# Walrus AI Policy & Governance Archive — Technical PRD

**Status:** Draft
**Date:** 2026-03-12
**Scope:** Web platform for publishing, preserving, and discovering AI policy research artifacts on Walrus decentralized storage.

---

## 1. Problem

AI governance knowledge is produced at scale but stored ephemerally — PDFs on institutional servers, datasets in personal drives, intermediate analysis artifacts discarded after publication. The structural failure modes are:

- **Link rot**: hosted documents disappear when institutions restructure or defund projects
- **Version ambiguity**: reports are silently updated without versioning, making citation unreliable
- **Missing provenance chain**: published conclusions exist but underlying data/code/analysis do not
- **No neutral home**: knowledge is trapped in organization-controlled storage with no independent durability guarantee

The consequence: the global policy conversation about AI cannot build on prior work with confidence. Researchers cannot reproduce analysis. Policymakers cannot trace where ideas came from.

---

## 2. Solution Framing

The archive is not a document CMS. It is an **artifact preservation layer** with a discovery interface on top.

The key design principle: **complete separation between storage and discovery**. The Walrus storage layer holds the truth. The web interface is replaceable. Even if the interface disappears, every uploaded artifact remains retrievable by its blob ID directly from Walrus aggregator nodes.

A **policy artifact bundle** is the unit of contribution. It is a structured collection of files representing a research or policy output — not just the final report, but the full evidence chain behind it.

---

## 3. Users

| Persona | Goal | Key flow |
|---|---|---|
| **Contributor** (researcher, think tank analyst) | Publish and preserve research artifacts with full provenance | Submission flow (§8) |
| **Consumer** (policymaker, journalist, citizen) | Find, read, and download policy artifacts | Discovery interface (§9) |
| **Verifier** (researcher, auditor) | Independently confirm an artifact's integrity and provenance | Re-derive bundle ID from manifest, check Sui `Blob` object, fetch from aggregator |
| **Sponsor** (institution, foundation, individual) | Fund storage extension for important bundles | Storage extension UI (Phase 3) |

---

## 4. Scope

### In Scope
- Web-based submission flow (upload artifacts + structured metadata)
- Walrus storage integration for all artifact files
- Walrus Blob Metadata dynamic fields for application-level tagging (no custom Move contract)
- Custom Rust indexer (`sui-indexer-alt-framework`) → PostgreSQL
- GraphQL API server for discovery queries
- Public discovery interface (browse, search, filter via GraphQL)
- Artifact bundle detail pages (manifest, file list, download)
- Walrus Sites deployment for the frontend

### Out of Scope
- CLI tooling (removed from initial scope)
- User authentication / accounts (v1 uses wallet-based signing)
- Comments, annotations, or social features
- Automated ingestion of external repositories

---

## 5. Walrus Storage Layer

Understanding Walrus is required to reason correctly about the architecture.

### 5.1 What Walrus Is

Walrus is a decentralized blob storage protocol built by Mysten Labs, coordinated by the Sui blockchain. It uses a proprietary 2D erasure coding scheme called **Red Stuff** (Reed-Solomon at mainnet) to shard and distribute data across a permissioned set of ~2,200 storage nodes. The data is encoded into sliver pairs — each node holds exactly one primary sliver and one secondary sliver.

Fault tolerance thresholds:
- **Write**: requires 2/3 quorum of storage nodes to acknowledge
- **Read**: requires only 1/3 quorum to reconstruct
- **Durability**: full data recovery even if 2/3 of nodes fail simultaneously
- **Storage overhead**: ~4.5× original blob size (vs full replication at N×)

The Sui blockchain handles:
- `Blob` object lifecycle (creation, certification, expiry)
- Storage payment and epoch accounting
- Ownership of `Blob` and `Storage` resource objects
- BLS certificate verification (Proof of Availability)

### 5.2 Blob Lifecycle

The `@mysten/walrus` TypeScript SDK handles the full write flow client-side via the `writeFilesFlow` method, which breaks blob storage into four stages:

```
1. encode   → client encodes files, generates blobId (WASM-based Reed-Solomon)
2. register → returns a Sui PTB that reserves storage + registers the blob on-chain
3. upload   → client distributes encoded slivers to storage nodes
4. certify  → returns a Sui PTB that submits the BLS certificate on-chain
```

A blob is **certified** (durably stored) once the `certify` transaction succeeds on Sui. The `Blob` Sui object is the on-chain Proof of Availability. Only certified blobs are guaranteed retrievable.

The SDK uses an **upload relay** to reduce client-to-storage-node HTTP requests from ~2,200 to 1 at the cost of a small SUI tip. This is the default behaviour when using the SDK.

### 5.3 Blob Identity

A Blob ID is a `u256` value encoded as a **URL-safe Base64 string**. It is derived from a vector commitment over all sliver commitments, then hashed together with file length and encoding type. This makes it content-addressed: the same file always produces the same blob ID. Re-uploading an identical file returns the existing certified blob — it is not re-stored.

Clients can independently verify retrieved data by re-encoding the reconstructed blob and recomputing the ID.

### 5.4 Blob Metadata (On-Chain Dynamic Field)

The Walrus `Blob` struct exposes public functions for attaching a `Metadata` dynamic field — a `VecMap<String, String>` of key-value pairs stored on the Sui `Blob` object:

```move
// Walrus contract — public, callable by any PTB (no custom contract needed)
public fun insert_or_update_metadata_pair(self: &mut Blob, key: String, value: String)
public fun remove_metadata_pair(self: &mut Blob, key: &String): (String, String)
```

The `Metadata` dynamic field is the only blob-level metadata visible on Sui (blob content stays fully off-chain). It is the mechanism by which the archive tags its manifest blobs for indexer identification.

For the manifest blob, we set: `archive-app: walrus-ai-policy-archive`, `bundle-id: <sha256>`, `title`, `topics`, `institution`, `published-date`, `content-type: application/json` (see §10.2 for full schema).

### 5.5 Storage Epochs and Funding

- **Mainnet epoch duration: 2 weeks**
- **Testnet epoch duration: 1 day**
- **Maximum storage duration: 53 epochs** (~2 years at mainnet cadence)
- Storage is paid upfront in **WAL tokens** for the full duration at upload time
- When epochs expire, storage nodes may delete shards; data recovery becomes probabilistic
- Storage can be extended via `walrus extend --blob-obj-id <SUI_OBJ_ID> --epochs-extended N` before expiry
- WAL denomination: `1 WAL = 1,000,000,000 FROST`

For public-good archives, bundles should be funded for a minimum of **52 epochs (~2 years)** upfront — one epoch below the protocol maximum. The community storage extension path (Phase 3) is essential since the maximum single purchase is ~2 years.

Cost formula: `WAL_cost = encoded_size × storage_price_per_unit × epochs`
(Current rates visible at `costcalculator.wal.app`)

### 5.6 SDK and Aggregator API

**Write path** — handled entirely by the `@mysten/walrus` TypeScript SDK:

```typescript
import { WalrusFile } from '@mysten/walrus';

// SDK handles encode → register → upload → certify internally
const result = await client.walrus.writeFiles({
  files: [WalrusFile.from({ contents, identifier: 'report.pdf' })],
  epochs: 52,
  deletable: false,
});
// Returns: { blobId, blobObject (Sui object ID) } per file
```

The SDK manages sliver distribution, BLS quorum collection, and Sui transactions. No direct Publisher REST API calls needed.

**Read path** — Aggregator REST API:
```
GET /v1/blobs/<blob_id>           → raw binary bytes
GET /v1/blobs/<blob_id>/status    → certification status, epoch info
```

**Public endpoints:**

| Network | Aggregator |
|---|---|
| Mainnet | `aggregator.walrus-mainnet.walrus.space` |
| Testnet | `aggregator.walrus-testnet.walrus.space` |

### 5.7 Quilt Format (Multi-File Bundles)

Walrus supports a **Quilt** format: bundling up to ~660 files into a single blob with individual file retrievability. Cost savings are significant — ~106× cheaper for 100 KB files, ~420× for 10 KB files versus storing each as a separate blob.

```typescript
// Upload multiple files as a quilt via the SDK
const result = await client.walrus.writeFiles({
  files: [
    WalrusFile.from({ contents: reportPdf, identifier: 'report.pdf' }),
    WalrusFile.from({ contents: dataCsv, identifier: 'data/survey.csv' }),
  ],
  epochs: 52,
});
// Returns: { blobId (quilt), files: { 'report.pdf': { quiltPatchId }, ... } }
```

Individual files within a quilt are accessible without downloading the full quilt blob:
```
GET /v1/blobs/by-quilt-patch-id/<quiltPatchId>         → raw file bytes
GET /v1/blobs/by-quilt-id/<quiltBlobId>/<identifier>   → raw file bytes
```

The manifest stores `quiltBlobId` + each file's `quiltPatchId` for direct retrieval links.

**Design decision for bundles**: Upload all artifact files as a Quilt via the SDK, then store the manifest JSON as a separate regular blob referencing the quilt blob ID and per-file patch IDs. This dramatically reduces storage cost for bundles with many small supplementary files.

### 5.8 Walrus Sites

Walrus Sites hosts static web applications on Walrus. Each resource (HTML, JS, CSS, images) is a Walrus blob. A Sui `Site` object holds routing as on-chain dynamic fields keyed by resource path:

```move
struct Resource has store, drop {
    path: String,
    blob_id: u256,
    blob_hash: vector<u8>,
    headers: VecMap<String, String>,
}
```

Routes and SPA fallbacks are configured via a `ws-resources.json` in the project root:
```json
{
  "routes": { "/*": "/index.html" },
  "headers": { "/index.html": { "cache-control": "no-cache" } }
}
```

The portal resolves requests: `<base36_object_id>.walrus.site` → Sui Site object → blob ID per path → Walrus aggregator → served to browser. SuiNS names resolve via `<name>.wal.app`.

The discovery interface will be deployed as a Walrus Site — the platform's own frontend is stored on Walrus, consistent with the archival mission.

---

## 6. Data Model

### 6.1 Policy Artifact Bundle

An artifact bundle represents one policy contribution. It maps to a **manifest blob** on Walrus that describes all other files in the bundle.

```typescript
type ArtifactBundle = {
  // Identity
  bundleId: string;           // SHA-256 of canonical manifest JSON
  manifestBlobId: string;     // Walrus blob ID of the manifest itself

  // Authorship
  authors: Author[];
  institution: string;
  submitterAddress: string;   // Sui wallet address

  // Classification
  title: string;
  abstract: string;
  publishedDate: string;      // ISO 8601
  submittedAt: string;        // ISO 8601, platform submission timestamp
  topics: PolicyTopic[];      // enumerated values (see §6.3)
  artifactTypes: ArtifactType[];

  // Storage
  files: ArtifactFile[];
  storageEpochs: number;
  suiObjectId: string;        // Sui object tracking this bundle's storage

  // Discovery
  tags: string[];
  license: string;            // SPDX identifier or custom
  version: string;
  revisionOf?: string;        // bundleId of the prior version (see §6.4)
  relatedBundles: string[];   // bundleIds of related (non-revision) work
}

type ArtifactFile = {
  path: string;               // relative path within bundle, e.g. "report.pdf"
  quiltPatchId?: string;      // Walrus quilt patch ID (when stored in a quilt)
  blobId?: string;            // Walrus blob ID (when stored as standalone blob)
  mimeType: string;
  sizeBytes: number;
  role: ArtifactRole;         // "primary" | "dataset" | "code" | "supplementary"
  description: string;
}
// Exactly one of quiltPatchId or blobId must be present per file.

type Author = {
  name: string;
  orcid?: string;             // ORCID identifier if provided
  affiliation?: string;
}
```

### 6.2 Manifest Format

The manifest is a deterministically serialized JSON file stored as a regular Walrus blob. The bundle ID is derived from it. All blob IDs it references must be certified on Walrus before the manifest is submitted.

The manifest references a **quilt blob ID** for the artifact files. Individual file paths and their intra-quilt identifiers are enumerated in the `files` array.

```json
{
  "walrus_archive_manifest_version": "1",
  "title": "...",
  "authors": [...],
  "quilt_blob_id": "<base64url>",
  "files": [
    {
      "path": "report.pdf",
      "quilt_identifier": "report.pdf",
      "size_bytes": 1048576,
      "mime_type": "application/pdf",
      "role": "primary"
    },
    {
      "path": "data/survey_responses.csv",
      "quilt_identifier": "data/survey_responses.csv",
      "size_bytes": 204800,
      "mime_type": "text/csv",
      "role": "dataset"
    }
  ],
  "topics": ["ai_safety", "governance_frameworks"],
  "published_date": "2026-01-15",
  "license": "CC-BY-4.0"
}
```

> For bundles containing a single large file (e.g. a 200 MB dataset), that file is stored as a standalone blob rather than a quilt, and `quilt_blob_id` is omitted in favour of a direct `blob_id` field on the file entry.

### 6.3 Policy Topic Taxonomy (v1)

Controlled vocabulary for topic classification:
- `ai_safety`
- `ai_governance_frameworks`
- `labor_markets`
- `economic_policy`
- `regulatory_proposals`
- `international_coordination`
- `technical_standards`
- `civil_society`
- `national_strategies`
- `risk_assessment`

### 6.4 Versioning & Revisions

Bundles are immutable — blob content is content-addressed and cannot change. A revision is a **new bundle** that explicitly links to the prior version.

**Mechanism**: The manifest keeps `relatedBundles` for non-revision relationships, while a `revision_of` field identifies the direct predecessor in a version chain:

```json
{
  "walrus_archive_manifest_version": "1",
  "version": "2",
  "revision_of": "<bundleId_of_v1>",
  "title": "...",
  ...
}
```

**Rules:**
- Each revision is a fully self-contained bundle with its own `bundleId`, `manifestBlobId`, and quilt
- The submitter uploads the complete artifact set again (even unchanged files deduplicate via content-addressing — same blob ID, no extra storage cost)
- The indexed metadata row and GraphQL bundle summary include `revisionOf`, enabling the SPA to display version chains without fetching every manifest first
- On the bundle detail page, the UI links to prior and subsequent versions when they exist
- No bundle is ever deleted or overwritten — all versions remain independently accessible

This directly addresses the "version ambiguity" problem: every version is a distinct, content-addressed, immutable snapshot.

### 6.5 Discovery via Custom Indexer

**The core problem**: Sui has no index on dynamic field content or arbitrary object fields. Sui RPC only supports filtering by object **type** and **owner**. Client-side index JSON blobs do not scale reliably and create update-race and freshness problems.

**Solution**: A custom Rust indexer built on `sui-indexer-alt-framework` subscribes to Sui checkpoint data, inspects Walrus `Blob` objects and their `Metadata` dynamic fields, filters for manifest blobs tagged with `archive-app = "walrus-ai-policy-archive"`, extracts discovery-critical metadata, and writes it to PostgreSQL. A GraphQL API server reads from Postgres and serves the SPA.

**Discovery flow:**

1. The SPA queries the **GraphQL API** for paginated, filtered, full-text searchable bundle listings. Server-side Postgres handles search, sort, and pagination.
2. For bundle detail pages, the SPA fetches the full manifest blob from the **Walrus aggregator** using the `manifestBlobId` returned by GraphQL.
3. File downloads go directly to the Walrus aggregator via `quiltPatchId` or `blobId`.

**Why this is better than the client-side index blob approach:**
- No stale index — the indexer processes checkpoints continuously
- No update races — Postgres handles concurrent writes
- Server-side search — no need to download the full index client-side
- No index blob ID pointer problem (old Q5) — the GraphQL endpoint is stable
- Spam filtering is structural — only blobs with `archive-app` metadata are indexed

---

## 7. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     User (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Discovery SPA│  │ Submission   │                       │
│  │              │  │ Flow         │                       │
│  └──────┬───────┘  └──────┬───────┘                       │
└─────────┼─────────────────┼───────────────────────────────┘
          │ GraphQL          │ Walrus TS SDK +
          │ queries          │ Sui PTB (Metadata)
   ┌──────▼──────┐    ┌──────▼──────┐    ┌──────────────┐
   │  GraphQL    │    │  Walrus     │    │  Sui         │
   │  API Server │    │  Storage    │    │  Fullnode    │
   └──────┬──────┘    │  Network   │    └──────┬───────┘
          │           └──────┬──────┘           │
          │                  │                  │
   ┌──────▼──────┐           │                  │
   │ PostgreSQL  │           │                  │
   └──────▲──────┘           │                  │
          │                  │                  │
   ┌──────┴──────┐           │                  │
   │  Custom     │           │                  │
   │  Indexer    │◄──────────┼──────────────────┘
   │  (Rust)     │     checkpoint stream
   └─────────────┘           │
                    ┌────────▼────────┐
                    │  Walrus Storage  │
                    │  Network         │
                    └────────┬────────┘
                             │ certify blobs
                    ┌────────▼────────┐
                    │  Sui Blockchain  │
                    │  - Blob objects   │
                    │    with Metadata  │
                    │    dynamic fields │
                    │  - Payments       │
                    └──────────────────┘
```

**Components:**

- **Walrus Blob Metadata**: Walrus's built-in `Metadata` dynamic field on `Blob` objects. No custom Move contract. The submitter calls `blob.insert_or_update_metadata_pair()` to tag the manifest blob with `archive-app: walrus-ai-policy-archive` and other metadata fields.
- **Custom Rust indexer**: Built on `sui-indexer-alt-framework`. Subscribes to Sui checkpoint stream, filters for `Blob` objects whose `Metadata` dynamic field contains `archive-app = "walrus-ai-policy-archive"`, extracts metadata, writes to PostgreSQL.
- **GraphQL API server**: Reads from PostgreSQL. Serves paginated, filtered, searchable bundle queries to the SPA.
- **Frontend SPA**: Walrus Site. Queries GraphQL for discovery, uses the Walrus TypeScript SDK for uploads, and sets Blob Metadata via Sui PTB for registration.

### 7.1 Component Responsibilities

- **Write path**: Browser → Walrus TS SDK (upload files as quilt + manifest blob) → Sui PTB (set Metadata on manifest Blob) → Indexer picks up Blob + Metadata from checkpoint stream → Postgres
- **Read path**: Browser → GraphQL API → Postgres (metadata) → Walrus Aggregator (manifest blob + file downloads)
- No wallet required for browsing/reading — wallet only needed for submission

---

## 8. Submission Flow (Web)

The submission flow replaces the removed CLI. It must handle potentially large multi-file uploads with clear progress feedback.

### 8.1 Steps

```
Step 1: Connect Wallet
  → User connects Sui-compatible wallet (via @mysten/dapp-kit)
  → Platform reads wallet address for submitter attribution
  → Check WAL balance; warn if insufficient for estimated cost

Step 2: Upload Files
  → User drags files or selects via file picker
  → Client-side validation: file type, size per file, total size
  → Upload via @mysten/walrus SDK (writeFiles / writeFilesFlow):
      - Multiple files: uploaded as Quilt (up to ~660 files)
      - Single file: uploaded as standalone blob
      - SDK handles encode → register → upload → certify
  → Show per-file upload progress (writeFilesFlow exposes stage callbacks)
  → On completion: display quilt_blob_id + per-file quiltPatchIds

Step 3: Fill Metadata
  → Title, abstract, authors, institution
  → Publication date, license (SPDX selector)
  → Topic classification (multi-select from taxonomy)
  → Per-file: role assignment (primary / dataset / code / supplementary)
  → Per-file: short description

Step 4: Review & Submit
  → Display storage cost breakdown: epochs × encoded_size × price
  → Generate manifest JSON deterministically (sorted keys, no whitespace)
  → Compute bundle_id = SHA-256(manifest_json_bytes)
  → Upload manifest JSON to Walrus via SDK:
      client.walrus.writeFiles({ files: [manifestFile], epochs: 52 })
  → Receive manifestBlobId + Sui Blob object ID
  → Build PTB that calls walrus::blob::insert_or_update_metadata_pair()
    on the manifest Blob object for each metadata key-value pair:
      archive-app, archive-version, bundle-id, title, topics,
      institution, published-date, revision-of?, content-type (see §10.2)
  → User signs the PTB via wallet
  → The indexer detects the Blob's Metadata at the next checkpoint
  → Bundle becomes discoverable via GraphQL within seconds

Step 5: Confirmation
  → Display: bundle_id, manifestBlobId, Sui Blob object ID
  → Permalink: https://<site>.walrus.site/bundle/<bundle_id>
  → Per-file: direct Walrus aggregator download URL
  → Shareable citation snippet
```

### 8.2 File Constraints (v1)

The Walrus TS SDK handles encoding and sliver distribution client-side, so there is no server-side body limit. The practical constraint is the Walrus protocol's maximum blob size (~13.3 GiB) and client-side memory/bandwidth.

**v1 file policy:**
- Maximum individual file size: **100 MiB** (practical limit for browser uploads; larger files degrade UX)
- Maximum files per bundle: **50** (well within quilt's ~660 limit)
- Accepted MIME types: PDF, CSV, JSON, XLSX, ZIP, TXT, MD, PNG, JPEG, Python/R scripts
- Minimum storage purchased: **52 epochs (~2 years at mainnet cadence)**
- Maximum storage purchased: **53 epochs (~2 years)** — the protocol maximum; extension required for longer preservation

### 8.3 Storage Cost Estimation

Before submission, the UI calculates and displays:
- Total bytes across all files
- Estimated WAL cost = `total_bytes × storage_price × epochs`
- Current WAL/USD rate (informational)

User must have sufficient WAL in their connected wallet.

---

## 9. Discovery Interface

The discovery interface is a SPA served as a Walrus Site. It queries the GraphQL API for bundle listings and individual bundle details. All search, filtering, and pagination happen server-side in Postgres.

### 9.1 GraphQL Queries

The SPA uses two primary queries:

```graphql
query BundleList(
  $topics: [String!]
  $search: String
  $institution: String
  $publishedDateFrom: String
  $publishedDateTo: String
  $limit: Int
  $offset: Int
  $sort: SortField
) {
  bundles(
    topics: $topics
    search: $search
    institution: $institution
    publishedDateFrom: $publishedDateFrom
    publishedDateTo: $publishedDateTo
    limit: $limit
    offset: $offset
    sort: $sort
  ) {
    items {
      bundleId
      manifestBlobId
      title
      institution
      topics
      publishedDate
      submittedAt
      revisionOf
      endEpoch
    }
    totalCount
  }
}

query BundleDetail($bundleId: String!) {
  bundle(bundleId: $bundleId) {
    bundleId
    manifestBlobId
    suiObjectId
    title
    institution
    topics
    publishedDate
    submittedAt
    revisionOf
    endEpoch
    certifiedEpoch
    submitter
  }
}
```

The full manifest (file listing, authors, abstract) is fetched from the Walrus aggregator on the bundle detail page, not stored in Postgres.

### 9.2 Pages

**Home / Browse**
- List of recent submissions (paginated via GraphQL)
- Filter sidebar: topics, date range, institution
- Search bar: full-text over title + institution (server-side Postgres `tsvector`)
- Sort: newest, oldest

**Bundle Detail Page**
- Full metadata display
- File list with roles, sizes, MIME types
- Per-file: download button (links directly to Walrus aggregator URL)
- Manifest JSON: copyable blob ID, raw JSON viewer
- Sui object link: verify on-chain storage record
- "Cite this bundle": generates citation with stable blob ID reference

**About Page**
- How the archive works
- How artifacts remain durable
- How to verify any artifact independently (direct Walrus aggregator access)

---

## 10. On-Chain Submission Records (Blob Metadata)

No custom Sui Move contract is deployed. The archive uses Walrus's built-in **Blob Metadata** — a `VecMap<String, String>` dynamic field that the Walrus contract natively supports on every `Blob` object via public functions.

### 10.1 Why No Custom Contract

The Walrus `Blob` struct exposes `insert_or_update_metadata_pair(key, value)` as a **public Move function**. This adds a `Metadata` dynamic field (type `walrus::metadata::Metadata`) to the `Blob` object. Any application can call this to attach structured key-value metadata without deploying its own contract.

This means:
- The Sui `Blob` object IS the submission proof — immutable, timestamped, owned by the submitter
- Metadata key-value pairs store application-specific fields directly on the Blob — no separate registry needed
- No Move code to write, audit, or deploy
- The `Metadata` dynamic field has a known, stable type (`0x2::dynamic_field::Field<vector<u8>, walrus::metadata::Metadata>`) that the indexer can filter on

### 10.2 Manifest Blob Metadata Schema

When a manifest blob is uploaded, the submitter attaches these metadata pairs to its Sui `Blob` object. This duplicates the discovery-critical subset of manifest fields on-chain so the indexer can power browse/search/filter/version-chain queries without fetching every manifest blob.

| Key | Value | Purpose |
|---|---|---|
| `archive-app` | `"walrus-ai-policy-archive"` | **Application tag** — the indexer uses this key's presence to identify archive blobs |
| `archive-version` | `"1"` | Schema version for forward compatibility |
| `bundle-id` | `"<sha256_hex>"` | Deterministic ID derived from manifest content |
| `title` | `"..."` | Bundle title for on-chain discoverability |
| `topics` | `"ai_safety,governance_frameworks"` | Comma-separated topic list |
| `institution` | `"..."` | Submitting institution |
| `published-date` | `"2026-01-15"` | Original publication date |
| `revision-of` | `"<prior_bundle_id>"` | Optional direct predecessor for revision chains |
| `content-type` | `"application/json"` | Standard content-type |

These are set client-side by building a PTB that calls `walrus::blob::insert_or_update_metadata_pair` on the manifest `Blob` object for each key-value pair. The user signs this transaction via their wallet.

### 10.3 How the Indexer Identifies Archive Blobs

The custom indexer (§6.5) processes Sui checkpoint data and inspects every `Blob` object's dynamic fields. It filters by:

1. **Dynamic field type match**: The object's dynamic field must be of type `walrus::metadata::Metadata` (the Walrus-native metadata type)
2. **Application key match**: The metadata must contain `archive-app = "walrus-ai-policy-archive"`

Only blobs matching both conditions are indexed. This prevents the indexer from processing unrelated Walrus blobs while requiring zero custom Move code.

### 10.4 Blob Lifecycle Tracking

The Sui `Blob` object contains `certified_epoch` and `storage.end_epoch` fields. The indexer extracts these into Postgres. The GraphQL API exposes them so the SPA can display storage expiry countdowns without additional Sui RPC calls.


---

## 11. Walrus Sites Deployment

Both the discovery interface and submission flow are deployed as Walrus Sites.

### 11.1 Site Object Structure (Sui Move)

A Walrus Site is a Sui object where each route maps to a Walrus blob ID. The `site:publish` CLI tool (from the Walrus Sites SDK) handles packaging the build output and creating/updating the Sui site object.

### 11.2 Deployment Process

```bash
# Build static frontend (Vite outputs to ./dist)
pnpm build

# First deploy (creates new Sui Site object)
site-builder deploy ./dist --epochs 52

# Subsequent updates (only changed blobs re-uploaded)
# object_id stored in ws-resources.json after first deploy
site-builder deploy ./dist

# Access immediately after deploy:
# https://<base36_object_id>.walrus.site
```

`ws-resources.json` must be present in `./dist` root to enable SPA routing:
```json
{
  "routes": { "/*": "/index.html" }
}
```

GitHub Actions integration available for CI/CD via `MystenLabs/walrus-sites-github-actions`.

### 11.3 Custom Domain

Via SuiNS: register `aipolicyarchive.sui` and point it to the site object ID. Accessible at `https://aipolicyarchive.wal.app` through the Walrus portal.

---

## 12. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | | |
| Framework | Vite + React | Fast builds, native WASM support, static output compatible with Walrus Sites |
| Wallet integration | `@mysten/dapp-kit` | Official Sui React hooks, multi-wallet (Sui Wallet, Suiet, etc.) |
| Sui SDK | `@mysten/sui` | Official TypeScript SDK for PTB construction and RPC |
| Walrus SDK | `@mysten/walrus` | Official SDK; handles full write flow (encode, register, upload, certify) + WASM-based Reed-Solomon |
| Styling | Tailwind CSS | Standard, no runtime overhead |
| Site deployment | `site-builder` CLI | Official Walrus Sites tooling |
| **Backend** | | |
| Indexer framework | `sui-indexer-alt-framework` (Rust) | Official Sui framework for custom checkpoint-based indexers |
| Database | PostgreSQL + Diesel ORM | Framework's native store; proven for structured metadata queries |
| GraphQL server | `async-graphql` (Rust) | Lightweight, reads from same Postgres the indexer writes to |
| **On-chain** | | |
| Blob identification | Walrus `Blob` Metadata dynamic field | Built-in `insert_or_update_metadata_pair()` — no custom Move contract |

**SDK integration note**: `@mysten/walrus` depends on `@mysten/walrus-wasm` for Reed-Solomon encoding/decoding and BLS aggregation. The WASM asset must be imported explicitly in the Vite build:
```typescript
import walrusWasmUrl from '@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url';
const client = new SuiGrpcClient({ network: 'mainnet' })
  .$extend(walrus({ wasmUrl: walrusWasmUrl }));
```

---

## 13. Funding Model

Storage on Walrus is paid upfront in WAL tokens. The maximum single purchase is ~2 years (53 epochs). For an archive intended to last decades, a sustainable funding strategy is required.

### 13.1 v1: Submitter Pays

In v1, the submitter's wallet pays the WAL cost at upload time. The UI displays the cost breakdown before submission. This is the simplest model and avoids treasury management complexity.

**Trade-off**: This creates a barrier for non-crypto researchers. Mitigation paths (not in v1):
- Platform treasury pre-funds submissions and invoices institutions in fiat
- Grant programs sponsor WAL tokens for approved research

### 13.2 Storage Extension (Phase 3)

Since the protocol maximum is ~2 years per purchase, long-term preservation requires periodic extension. Phase 3 introduces a storage extension UI where **any wallet** can fund additional epochs for any bundle via `walrus extend`.

Possible funding sources for extensions:
- **Submitting institution** extends its own bundles as part of ongoing commitment
- **Community sponsorship**: any user can extend bundles they consider valuable
- **Foundation grants**: bulk extension of bundles in a topic area (e.g., a foundation funds all `ai_safety` bundles for another 2 years)
- **Tip jar**: the bundle detail page surfaces a "fund this archive" action with pre-set epoch amounts

### 13.3 Cost Visibility

The SPA displays per-bundle:
- Current storage expiry date (derived from Sui `Blob` object's `storage.end_epoch`)
- Estimated WAL cost to extend by 1 year / 2 years
- Warning when a bundle is within 4 epochs (~8 weeks) of expiry

---

## 14. Security Considerations

**Blob ID spoofing**: Blob IDs are content-derived. A submitter cannot claim a blob ID they didn't actually upload. The manifest links files to their correct blob IDs and is itself stored as a certified blob.

**Manifest tampering**: The bundle ID is the hash of the manifest. Any mutation of the manifest produces a different bundle ID, detectable by the verifier.

**On-chain immutability**: Walrus `Blob` objects on Sui are owned by the submitter. Blob attributes (once set) are visible on-chain. The submitter can update attributes on their own `Blob` object, but cannot alter the blob content itself (content-addressed by blob ID). A changed attribute is detectable because Sui tracks object versions.

**Storage expiry risk**: If storage epochs run out, nodes may delete shards. Mitigation: purchase maximum 52 epochs (~2 years) upfront; surface epoch countdown in the UI; emit warnings when a bundle's storage is within 4 epochs (~8 weeks) of expiry. The Sui `Blob` object's `storage.end_epoch` field provides expiry information directly.

**Spam / content policy**: Anyone with a wallet can set `archive-app` metadata on their blob. The indexer will pick it up. Mitigation: the GraphQL API can include an operator-managed allowlist or flagging table in Postgres. Unflagged bundles appear in the UI but can be hidden by the operator. The on-chain data remains independently verifiable regardless. Future: on-chain allowlist via a lightweight contract if needed.

**Indexer integrity**: The indexer is a derived view — it reads from Sui checkpoints and can be rebuilt from scratch. If the Postgres database is corrupted or the indexer produces incorrect data, re-indexing from genesis (or a recent checkpoint) restores correct state. The indexer never modifies on-chain data.

**GraphQL API availability**: If the GraphQL server is down, the SPA cannot load bundle listings. Mitigation: the SPA's About page documents how to verify any bundle independently via Sui RPC + Walrus aggregator. The GraphQL server is stateless (reads from Postgres) and can be horizontally scaled or redeployed quickly.

---

## 15. Phased Delivery

### Phase 1 — Core Archive (MVP)
- Custom Rust indexer: `sui-indexer-alt-framework` pipeline filtering for Blob Metadata with `archive-app` key → Postgres
- GraphQL API server reading from Postgres
- Web submission flow: wallet connect, multi-file upload to Walrus (quilt), metadata form, Blob Metadata setting via PTB
- Discovery interface: browse, filter by topic, bundle detail page with download links
- Walrus Sites deployment of frontend

Deliverable: fully functional archive on Walrus testnet with indexer-backed discovery

### Phase 2 — Search & Verification
- Full-text search via Postgres `tsvector` exposed through GraphQL
- Bundle verification page: re-derive bundle_id from manifest, check Sui `Blob` object, verify blob certification and metadata
- Storage epoch countdown display per bundle (from indexed `end_epoch`)
- Cite-this-bundle UI with stable aggregator links

### Phase 3 — Sustainability & Independence
- Storage extension UI: any wallet can fund additional epochs for any bundle via `walrus extend`
- SuiNS domain registration (`aipolicyarchive.sui` → `aipolicyarchive.wal.app`)
- Community curation: operator allowlist in Postgres, or on-chain allowlist via lightweight contract if needed

---

## 16. Open Questions

| # | Question | Impact | Owner |
|---|---|---|---|
| Q1 | Who funds storage — submitter pays WAL directly, or platform treasury subsidizes? If submitter pays, the wallet/token requirement is a barrier for non-crypto researchers. | Adoption vs. sustainability | Product |
| Q2 | Should the archive eventually adopt a custom Sui Move contract for structured governance (voting, curation, permissionless extension)? If so, at what scale/maturity threshold? | Long-term architecture | Engineering + Product |
