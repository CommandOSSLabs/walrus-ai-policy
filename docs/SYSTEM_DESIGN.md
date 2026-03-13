# Walrus AI Policy & Governance Archive — System Design

**Source PRD:** `docs/PRD.md`
**Date:** 2026-03-12

This document covers architecture, component design, data flows, state management, and integration patterns. The PRD remains the source of truth for scope and product decisions.

---

## 1. Architectural Principles

1. **Storage-first**: Walrus is the system of record. The indexer and GraphQL API are derived views. If they disappear, every artifact is still retrievable by blob ID from any Walrus aggregator.
2. **No custom contract**: Walrus's built-in `Blob` Metadata dynamic field provides the beacon for indexer discovery. The archive avoids deploying Move code by calling Walrus's public `insert_or_update_metadata_pair()` function.
3. **Manifest as source of truth**: All content metadata lives in the immutable manifest blob on Walrus. Sui Blob Metadata is mutable by the owner, so it is used only as a beacon (`archive-app` + `bundle-id`) — never trusted for content fields.
4. **Deterministic identity**: A bundle's identity is the SHA-256 of its canonical manifest JSON. Content-addressed end-to-end — from individual file blob IDs up to the bundle level.
5. **Indexer as performance layer**: The custom Rust indexer + Postgres + GraphQL server exist for query performance. They are not the source of truth — that remains the Walrus manifest blobs and Sui `Blob` objects.
6. **Manifest-rich, index-light**: Rich authorship, abstract, license, version, and file metadata live in the manifest blob. Postgres only indexes the discovery-critical subset needed for browse, search, filtering, revision chains, and storage expiry.

---

## 2. System Topology

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser Runtime                           │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │  Router     │  │ Wallet     │  │ Walrus     │                 │
│  │  (React     │  │ Adapter    │  │ Client     │                 │
│  │   Router)   │  │ (dapp-kit) │  │ (@mysten/  │                 │
│  │            │  │            │  │  walrus)   │                 │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                 │
│        │               │               │                         │
│  ┌─────▼───────────────▼───────────────▼──────────────────────┐  │
│  │                    Application Layer                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │ Discovery    │  │ Submission   │  │ Verification     │  │  │
│  │  │ Module       │  │ Module       │  │ Module           │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ GraphQL            │ Walrus TS SDK      │ GET blobs
         │                    │ + Sui PTB          │
         ▼                    ▼                    ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │   GraphQL    │    │   Walrus     │    │   Walrus     │
  │   API Server │    │  Storage     │    │  Aggregator  │
  └──────┬───────┘    │  Network     │    └──────────────┘
         │            └──────┬───────┘
  ┌──────▼───────┐           │
  │  PostgreSQL  │           │
  └──────▲───────┘           │
         │            ┌──────▼──────┐
  ┌──────┴───────┐    │   Sui       │
  │   Custom     │◄───│  Fullnode   │
  │   Indexer    │    │  checkpoint │
  │   (Rust)     │    │  stream     │
  └──────────────┘    └─────────────┘
```

**External dependencies:**

| Dependency | Role | Failure impact |
|---|---|---|
| Walrus Aggregator | Read blobs (manifests, artifact files) | Downloads unavailable; indexed metadata still queryable via GraphQL |
| Walrus Storage Network | Write blobs via TS SDK (encode, distribute slivers) | Submission unavailable; existing data unaffected |
| Sui Fullnode | Checkpoint stream for indexer; wallet transactions | Indexer pauses (resumes on reconnect); submissions blocked |
| PostgreSQL | Indexed metadata store | GraphQL queries fail |

---

## 3. Indexer Design

### 3.1 Framework

Built on `sui-indexer-alt-framework` from the Sui monorepo. The framework provides:

- **IngestionService**: Fetches checkpoints from a remote store (e.g., `https://checkpoints.testnet.sui.io`) or gRPC stream
- **Processor trait**: Transforms raw checkpoint data into typed rows
- **Handler trait**: Batches and commits rows to the store (Postgres via Diesel)
- **Watermark management**: Tracks which checkpoints have been committed, enabling crash recovery

### 3.2 Pipeline Architecture

A single **sequential pipeline** processes all archive-related Blob Metadata:

```
Sui Checkpoint Stream
  → IngestionService (fetches + broadcasts checkpoints)
  → ArchiveBlobProcessor (Processor trait)
      - For each checkpoint, inspect all output objects
      - Filter: object has dynamic field of type walrus::metadata::Metadata
      - Filter: Metadata contains key "archive-app" = "walrus-ai-policy-archive"
      - Extract from Sui: blob_id, certified_epoch, end_epoch, submitter address
      - Extract from Metadata: bundle-id (for integrity check only)
      - Fetch manifest blob from Walrus aggregator using blob_id
      - Verify: SHA-256(manifest_bytes) == bundle-id
      - Parse manifest JSON: title, topics, institution, published_date,
                 revision_of, original_bundle_id, version, etc.
      - Validate version chain: if original_bundle_id set, check Blob owner matches
      - Also detect deletions (input objects not in output = blob expired/burned)
  → ArchiveBlobHandler (sequential::Handler trait)
      - Batch upserts and deletes
      - Commit to Postgres atomically with watermark update
```

### 3.3 Processor Implementation Pattern

```rust
pub struct ArchiveBlobProcessor {
    metadata_df_type: StructTag, // walrus::metadata::Metadata dynamic field type
}

impl Processor for ArchiveBlobProcessor {
    const NAME: &'static str = "archive_blob";
    type Value = ProcessedArchiveBlob;

    async fn process(&self, checkpoint: &Arc<Checkpoint>) -> Result<Vec<Self::Value>> {
        let input_objects = checkpoint_input_objects(checkpoint)?;
        let output_objects = checkpoint_output_objects(checkpoint)?;
        let mut values = BTreeMap::new();

        // Deletions: in input but not in output
        for (id, obj) in &input_objects {
            if output_objects.contains_key(id) { continue; }
            if let Some(_) = extract_archive_metadata(&self.metadata_df_type, obj)? {
                values.insert(*id, ProcessedArchiveBlob::Delete(*id));
            }
        }

        // Upserts: in output (created, mutated, or unwrapped)
        for (id, obj) in &output_objects {
            if let Some((beacon, blob_fields)) =
                extract_archive_metadata(&self.metadata_df_type, obj)?
            {
                // Fetch manifest from Walrus and verify integrity
                let manifest_bytes = self.aggregator.fetch_blob(&blob_fields.blob_id).await?;
                let computed_hash = sha256_hex(&manifest_bytes);
                let expected_hash = beacon.get("bundle-id").unwrap_or_default();
                if computed_hash != expected_hash {
                    warn!("Bundle integrity check failed for blob {}", blob_fields.blob_id);
                    continue;
                }

                // Parse manifest JSON — source of truth for all content fields
                let manifest: ManifestV1 = serde_json::from_slice(&manifest_bytes)?;

                values.insert(*id, ProcessedArchiveBlob::Upsert {
                    dynamic_field_id: *id,
                    df_version: obj.version().into(),
                    bundle_id: computed_hash,
                    manifest_blob_id: blob_fields.blob_id,
                    title: manifest.title,
                    institution: manifest.institution,
                    topics: manifest.topics,
                    published_date: manifest.published_date,
                    revision_of: manifest.revision_of,
                    original_bundle_id: manifest.original_bundle_id,
                    submitted_at: checkpoint.summary.timestamp_ms,
                    submitter: obj.owner_address(),
                    certified_epoch: blob_fields.certified_epoch,
                    end_epoch: blob_fields.storage_end_epoch,
                });
            }
        }

        Ok(values.into_values().collect())
    }
}
```

The `extract_archive_metadata` function:
1. Checks if the object is a `dynamic_field::Field` wrapping `walrus::metadata::Metadata`
2. Deserializes the Metadata `VecMap`
3. Checks for `archive-app = "walrus-ai-policy-archive"` (beacon detection)
4. Returns the `bundle-id` value + parent Blob object fields if matched

After beacon detection, a separate step fetches the manifest blob from a Walrus aggregator, verifies `SHA-256(manifest_bytes) == bundle-id`, and parses the manifest JSON to extract all content fields (title, topics, authors, versioning, etc.). This ensures indexed data comes from the immutable manifest, not from mutable Blob Metadata.

### 3.4 Database Schema

```sql
CREATE TABLE archive_bundle (
    dynamic_field_id  BYTEA        PRIMARY KEY,  -- Metadata DF object ID
    df_version        BIGINT       NOT NULL,
    bundle_id         TEXT         NOT NULL,
    manifest_blob_id  TEXT         NOT NULL,
    title             TEXT         NOT NULL,
    institution       TEXT         NOT NULL,
    topics            TEXT[]       NOT NULL,
    published_date    DATE         NOT NULL,
    revision_of       TEXT,
    original_bundle_id TEXT,
    submitted_at      BIGINT       NOT NULL,      -- checkpoint timestamp ms
    submitter         BYTEA        NOT NULL,
    certified_epoch   INTEGER,
    end_epoch         INTEGER      NOT NULL
);

CREATE INDEX idx_bundle_id ON archive_bundle(bundle_id);
CREATE INDEX idx_topics ON archive_bundle USING GIN(topics);
CREATE INDEX idx_submitted_at ON archive_bundle(submitted_at DESC);
CREATE INDEX idx_published_date ON archive_bundle(published_date DESC);
CREATE INDEX idx_revision_of ON archive_bundle(revision_of);
CREATE INDEX idx_original_bundle_id ON archive_bundle(original_bundle_id);
CREATE INDEX idx_bundle_search ON archive_bundle USING GIN(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(institution, ''))
);
```

### 3.5 Indexer Startup

```rust
#[tokio::main]
async fn main() -> Result<()> {
    let args = ArchiveIndexerArgs::parse();
    let mut indexer = IndexerClusterBuilder::new()
        .with_database_url(args.database_url)
        .with_args(args.cluster_args)
        .with_migrations(&MIGRATIONS)
        .build()
        .await?;

    let pipeline = ArchiveBlobProcessor::new(
        WALRUS_METADATA_DF_TYPE.parse()?,
    );
    indexer
        .sequential_pipeline(pipeline, SequentialConfig::default())
        .await?;

    indexer.run().await?.main().await?;
    Ok(())
}
```

Run with:
```bash
archive-indexer --remote-store-url https://checkpoints.testnet.sui.io \
                --database-url postgres://user:pass@localhost/archive
```

---

## 4. GraphQL API Server

A separate Rust binary reads from the same Postgres database. Built with `async-graphql` + `axum`.

### 4.1 Schema

```graphql
type Query {
  bundles(
    topics: [String!]
    search: String        # full-text search over title + institution
    institution: String
    publishedDateFrom: String
    publishedDateTo: String
    limit: Int = 20
    offset: Int = 0
    sort: SortField = SUBMITTED_AT_DESC
  ): BundleConnection!

  bundle(bundleId: String!): Bundle
}

type BundleConnection {
  items: [BundleSummary!]!
  totalCount: Int!
}

type BundleSummary {
  bundleId: String!
  manifestBlobId: String!
  title: String!
  institution: String!
  topics: [String!]!
  publishedDate: String!
  submittedAt: String!          # ISO 8601
  revisionOf: String
  originalBundleId: String
  endEpoch: Int!
}

type Bundle {
  bundleId: String!
  manifestBlobId: String!
  suiObjectId: String!
  title: String!
  institution: String!
  topics: [String!]!
  publishedDate: String!
  submittedAt: String!
  revisionOf: String
  originalBundleId: String
  endEpoch: Int!
  certifiedEpoch: Int
  submitter: String!
}

enum SortField {
  SUBMITTED_AT_DESC
  SUBMITTED_AT_ASC
  PUBLISHED_DATE_DESC
  PUBLISHED_DATE_ASC
}
```

### 4.2 Query Resolution

- **`bundles` query**: SQL query against `archive_bundle` table. Topic filter uses `topics @> ARRAY[...]`. Search uses `to_tsvector('english', title || ' ' || institution) @@ plainto_tsquery(...)`. Date range filter uses `published_date BETWEEN ... AND ...`. Pagination via `LIMIT/OFFSET`.
- **`bundle` query**: Single row lookup by `bundle_id`.

The GraphQL server does NOT fetch manifest content from Walrus. The SPA fetches the full manifest blob directly from the Walrus aggregator on the bundle detail page — this keeps the GraphQL server stateless and fast while still exposing revision chains, storage expiry, and browse filters from indexed metadata.

### 4.3 Deployment

```bash
archive-graphql --database-url postgres://user:pass@localhost/archive \
                --listen 0.0.0.0:4000
```

The SPA connects to this endpoint via `VITE_GRAPHQL_URL`.

---

## 5. Data Flows

### 5.1 Submission Flow (Write Path)

```
Browser (`writeFilesFlow`)        Walrus Storage          Sui Fullnode          Indexer
  │                                     │                      │                  │
  1. Upload artifact files via SDK      │                      │                  │
     (encode → register →              │                      │                  │
      upload → certify)                │                      │                  │
     - single file → standalone blob   │                      │                  │
     - multi-file → quilt              │                      │                  │
     SDK uses upload relay             │                      │                  │
     to efficiently upload      ───────▶│                      │                  │
                                ◀───────│                      │                  │
     Returns { blobId/quiltBlobId,      │                      │                  │
               patchIds? }              │                      │                  │
                                        │                      │                  │
  2. Upload manifest blob via SDK       │                      │                  │
     (same encode→certify flow) ───────▶│                      │                  │
                                ◀───────│                      │                  │
     Returns { manifestBlobId,          │                      │                  │
               suiBlobObjectId }        │                      │                  │
                                        │                      │                  │
  3. Set beacon Metadata on manifest     │                      │                  │
     Blob via PTB (two fields only):    │                      │                  │
       archive-app = "walrus-ai-        │                      │                  │
         policy-archive"                │                      │                  │
       bundle-id = "<sha256>"    ───────────────────────────────▶│                 │
     User signs PTB via wallet          │                      │                  │
                                ◀──────────────────────────────│                  │
     TX confirmed                       │                      │                  │
                                        │                      │                  │
  4. (async) Checkpoint contains        │                      │                  │
     the Blob with Metadata DF          │                      │──checkpoint─────▶│
                                        │                      │                  │
                                        │                      │      ┌───────────▼──┐
                                        │                      │      │ Filter by    │
                                        │                      │      │ archive-app  │
                                        │                      │      │ beacon       │
                                        │                      │      └──────┬───────┘
                                        │                      │             │
                                  ◀─────┼──────────────────────┼─────────────┘
                              fetch manifest blob              │      ┌──────▼───────┐
                                  ─────►│                      │      │ Verify hash  │
                                        │                      │      │ Parse JSON   │
                                        │                      │      │ → write PG   │
                                        │                      │      └──────────────┘
  5. Bundle queryable via GraphQL       │                      │                  │
```

**Wallet signature points**: Steps 1 and 2 — the SDK builds `register` and `certify` PTBs that the user's wallet signs. Step 3 — the user signs the Metadata-setting PTB. `writeFilesFlow` stage callbacks drive progress UI and can be batched to reduce signature prompts where supported.

**Latency**: From submission to GraphQL visibility = checkpoint finalization (~2-3 seconds on Sui) + indexer processing (~subsecond). Total: ~3-5 seconds.

### 5.2 Discovery Flow (Read Path)

```
Browser                    GraphQL Server         PostgreSQL         Walrus Aggregator
  │                              │                      │                  │
  1. Browse page loads     │                              │                  │
  │                              │                      │                  │
  2. Query bundle list     │──bundles(topics,search)────▶│                  │
  │                        │◀─BundleConnection          │                  │
  │                              │                      │                  │
  3. User clicks bundle    │                              │                  │
  │                              │                      │                  │
  4. Query bundle detail   │──bundle(bundleId)──────────▶│                  │
  │                        │◀─Bundle                     │                  │
  │                              │                      │                  │
  5. Fetch manifest blob   │                              │──GET /v1/blobs──▶│
     from Walrus           │                              │◀─manifest JSON   │
  │                              │                      │                  │
  6. User downloads file   │                              │──GET by-quilt-──▶│
  │                        │                              │  patch-id/X      │
  │                        │                              │◀─raw file bytes  │
```

Steps 2 and 4 hit GraphQL. Steps 5 and 6 go directly to Walrus — no proxy through the GraphQL server.

### 5.3 Independence Verification Flow

Anyone can verify the archive without the indexer:

```
1. Query Sui RPC for all Blob objects (paginated)
     suix_queryObjects({ StructType: "walrus::blob::Blob" })
2. For each Blob, read dynamic fields
     suix_getDynamicFields(blobObjectId)
3. Filter for objects with Metadata containing archive-app key
4. Fetch manifest blob from any Walrus aggregator
     GET /v1/blobs/<blobId>
5. Re-derive bundle_id = SHA-256(manifest bytes)
6. Verify it matches the on-chain metadata
```

---

## 6. State Management

| State | Location | Mutability | Accessed by |
|---|---|---|---|
| Artifact file bytes | Walrus blobs (quilt or standalone) | Immutable (content-addressed) | Aggregator GET |
| Manifest JSON | Walrus blob | **Immutable** (content-addressed) — single source of truth for all content metadata | Aggregator GET; indexer fetches to populate Postgres |
| Bundle identity | Derived: SHA-256 of manifest bytes | Immutable (deterministic) | Computed client-side; verified by indexer |
| Blob certification proof | Sui `Blob` object | Immutable after certification | Indexer reads from checkpoint |
| Beacon metadata | Sui `Blob` Metadata dynamic field (`archive-app` + `bundle-id` only) | **Mutable by blob owner** — used only for indexer discovery, never trusted for content | Indexer reads from checkpoint |
| Storage expiry | Sui `Blob` object `storage.end_epoch` | Extended via `walrus extend` | Indexer reads from checkpoint |
| Indexed metadata | PostgreSQL `archive_bundle` table | Derived (from manifest blobs + Sui checkpoints) | GraphQL API reads |
| Revision chain | Manifest fields `revision_of` + `original_bundle_id` | Immutable per bundle version; validated via Blob owner matching | GraphQL API + bundle detail UI |
| Wallet connection | Browser memory (dapp-kit) | Session-scoped | React context |

The indexer's Postgres database is the only mutable server-side state, and it is fully derivable from Sui checkpoints. It can be rebuilt from scratch at any time.

---

## 7. Manifest Canonicalization

The bundle ID must be deterministic across environments.

**Rules:**
1. Keys sorted lexicographically at every nesting level
2. No whitespace (compact JSON)
3. Numbers as integers (no floating point for `size_bytes`)
4. Strings as UTF-8, no BOM
5. Arrays maintain insertion order (files ordered by `path` alphabetically)

```typescript
function canonicalize(manifest: ManifestInput): Uint8Array {
  const sorted = sortKeysDeep(manifest);
  sorted.files.sort((a, b) => a.path.localeCompare(b.path));
  const json = JSON.stringify(sorted);
  return new TextEncoder().encode(json);
}

function computeBundleId(manifestBytes: Uint8Array): string {
  const hash = await crypto.subtle.digest('SHA-256', manifestBytes);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 8. Upload Strategy Decision Tree

```
Input: files[] from user

  ├─ files.length > 50?
  │   └─ YES → reject ("maximum 50 files per bundle")
  │
  ├─ any file > 100 MiB?
  │   └─ YES → reject ("files over 100 MiB not supported in v1")
  │
  ├─ files.length == 1?
  │   └─ upload as standalone blob via Walrus SDK
  │      manifest references blobId directly (no quilt)
  │
  └─ files.length >= 2
      └─ upload all as quilt via Walrus SDK
         manifest references quiltBlobId + per-file quiltPatchId
```

---

## 9. Blob Metadata Setting (Beacon Only)

After the manifest blob is uploaded and certified, the submitter attaches **beacon-only** Metadata via a PTB. Only two fields are set — `archive-app` (indexer discovery) and `bundle-id` (integrity check). All content metadata lives in the immutable manifest blob.

```typescript
import { Transaction } from '@mysten/sui/transactions';

function buildBeaconMetadataTx(
  suiBlobObjectId: string,
  bundleId: string,
  walrusPackageId: string,
): Transaction {
  const tx = new Transaction();

  const pairs: Record<string, string> = {
    'archive-app': 'walrus-ai-policy-archive',
    'bundle-id': bundleId,
  };

  for (const [key, value] of Object.entries(pairs)) {
    tx.moveCall({
      target: `${walrusPackageId}::blob::insert_or_update_metadata_pair`,
      arguments: [
        tx.object(suiBlobObjectId),
        tx.pure.string(key),
        tx.pure.string(value),
      ],
    });
  }

  return tx;
}
```

**Why only two fields?** Blob Metadata is mutable by the blob owner at any time. Storing content fields (title, topics, etc.) in Metadata would allow silent post-submission tampering. The indexer instead fetches the immutable manifest blob from Walrus to extract content data.

**Ownership**: The submitter owns the `Blob` object (Walrus returns it to the uploader). Only the owner can set Metadata. The owner removing `archive-app` effectively de-lists their bundle from the index — this is acceptable since the owner should control their own visibility.

---

## 10. URL Schemes

### 10.1 Walrus URLs

| Purpose | Pattern |
|---|---|
| Fetch blob by ID | `https://{aggregator}/v1/blobs/{blobId}` |
| Fetch quilt file by patch ID | `https://{aggregator}/v1/blobs/by-quilt-patch-id/{quiltPatchId}` |
| Fetch quilt file by identifier | `https://{aggregator}/v1/blobs/by-quilt-id/{quiltBlobId}/{identifier}` |

Write-path calls are made through the Walrus TypeScript SDK rather than raw Publisher REST endpoints. The SDK still performs the same encode/register/upload/certify lifecycle, but direct upload URLs are treated as SDK internals in this application.

### 10.2 Application URLs (Walrus Site)

| Route | Page | Data source |
|---|---|---|
| `/` | Browse / home | GraphQL API |
| `/bundle/:bundleId` | Bundle detail | GraphQL (metadata) + Walrus aggregator (manifest blob) + client-side citation/verification helpers + storage-extension action (Phase 3) |
| `/submit` | Submission flow | Wallet + Walrus TS SDK + Sui PTB |
| `/verify/:bundleId` | Verification (Phase 2) | Manifest blob + Sui RPC |
| `/about` | Static content | None |

---

## 11. Project Structure

```
walrus-ai-policy/
├── docs/
│   ├── PRD.md
│   └── SYSTEM_DESIGN.md
│
├── frontend/                        # Vite + React SPA
│   ├── src/
│   │   ├── main.tsx
│   │   ├── client.ts                # Sui + Walrus SDK init (+ walrus-wasm)
│   │   ├── config.ts                # Network endpoints, GraphQL URL
│   │   │
│   │   ├── types/
│   │   │   ├── manifest.ts          # ManifestV1, ArtifactFile, Author
│   │   │   └── bundle.ts            # ArtifactBundle (app-level type)
│   │   │
│   │   ├── lib/
│   │   │   ├── manifest.ts          # canonicalize(), computeBundleId()
│   │   │   ├── upload.ts            # uploadQuilt(), uploadBlob()
│   │   │   ├── metadata.ts          # buildBeaconMetadataTx()
│   │   │   ├── citation.ts          # cite-this-bundle formatter
│   │   │   └── graphql.ts           # GraphQL query functions
│   │   │
│   │   ├── hooks/
│   │   │   ├── useBundles.ts        # Paginated bundle list from GraphQL
│   │   │   ├── useBundle.ts         # Single bundle + manifest fetch
│   │   │   ├── useSubmission.ts     # Multi-step submission pipeline
│   │   │   └── useStorageExpiry.ts  # Epoch countdown + extension quote inputs
│   │   │
│   │   ├── pages/
│   │   │   ├── Browse.tsx
│   │   │   ├── BundleDetail.tsx
│   │   │   ├── Submit.tsx
│   │   │   ├── Verify.tsx           # Phase 2
│   │   │   └── About.tsx
│   │   │
│   │   └── components/
│   │       ├── BundleCard.tsx
│   │       ├── CitationBox.tsx
│   │       ├── DateRangeFilter.tsx
│   │       ├── FileList.tsx
│   │       ├── MetadataForm.tsx
│   │       ├── FileUploader.tsx
│   │       ├── TopicFilter.tsx
│   │       ├── SearchBar.tsx
│   │       ├── CostEstimate.tsx
│   │       ├── EpochCountdown.tsx
│   │       ├── StorageExtensionCard.tsx
│   │       └── WalletGuard.tsx
│   │
│   ├── public/
│   │   └── ws-resources.json        # Walrus Sites SPA routing
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── indexer/                         # Rust custom indexer
│   ├── src/
│   │   ├── main.rs                  # Entry point, pipeline registration
│   │   ├── processor.rs             # ArchiveBlobProcessor (Processor trait)
│   │   ├── handler.rs               # ArchiveBlobHandler (sequential::Handler)
│   │   ├── extract.rs               # extract_archive_metadata() — Metadata DF parsing
│   │   ├── schema.rs                # Diesel schema (generated)
│   │   └── models.rs                # Diesel insertable/queryable structs
│   │
│   ├── migrations/
│   │   └── 001_create_archive_bundle/
│   │       ├── up.sql
│   │       └── down.sql
│   │
│   ├── Cargo.toml
│   └── diesel.toml
│
├── graphql/                         # Rust GraphQL API server
│   ├── src/
│   │   ├── main.rs                  # axum + async-graphql server
│   │   ├── schema.rs                # GraphQL type definitions
│   │   ├── resolvers.rs             # Query resolvers → Postgres
│   │   └── db.rs                    # Connection pool, query builders
│   │
│   └── Cargo.toml
│
└── docker-compose.yml               # Postgres + indexer + graphql for local dev
```

---

## 12. Error Handling

### 12.1 Upload Failures

| Failure point | Recovery |
|---|---|
| Quilt upload fails | Retry. Walrus deduplicates — re-uploading identical files is safe. |
| Manifest upload fails after quilt succeeds | Quilt remains (paid for). Retry manifest upload. |
| Metadata PTB fails after manifest uploaded | Manifest exists on Walrus but has no Metadata. Retry the PTB — `insert_or_update_metadata_pair` is idempotent. |
| Indexer misses a checkpoint | Framework handles this — watermark tracking ensures no gaps. On restart, indexer resumes from last committed watermark. |

### 12.2 Read Failures

| Failure point | Fallback |
|---|---|
| GraphQL server down | SPA shows error; About page documents independent verification via Sui RPC + Walrus aggregator |
| Aggregator down | Display blob IDs so users can try alternative aggregators |
| Postgres corrupted | Re-index from Sui checkpoints (full rebuild) |

### 12.3 Storage Expiry

The indexer stores `end_epoch` in Postgres. The GraphQL API exposes it. The SPA renders warnings when `end_epoch - current_epoch ≤ 4` (~8 weeks).

---

## 13. Configuration

### 13.1 Frontend (`frontend/.env`)

```bash
VITE_NETWORK=testnet                              # or mainnet
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_GRAPHQL_URL=https://api.aipolicyarchive.app/graphql
VITE_WALRUS_PACKAGE_ID=0x...                       # Walrus contract package on Sui
```

### 13.2 Indexer

```bash
REMOTE_STORE_URL=https://checkpoints.testnet.sui.io
DATABASE_URL=postgres://user:pass@localhost:5432/archive
```

### 13.3 GraphQL Server

```bash
DATABASE_URL=postgres://user:pass@localhost:5432/archive
LISTEN_ADDR=0.0.0.0:4000
```

---

## 14. Deployment

### 14.1 Infrastructure

| Component | Hosting | Notes |
|---|---|---|
| Frontend SPA | Walrus Sites | Decentralized; deployed via `site-builder` |
| PostgreSQL | Managed service (e.g., Supabase, RDS, or self-hosted) | Single database shared by indexer and GraphQL |
| Indexer | Container (Docker) on VM | Long-running process; needs persistent storage for Postgres connection |
| GraphQL server | Container (Docker) on VM | Stateless; can be horizontally scaled |
| SuiNS domain (Phase 3) | `aipolicyarchive.sui` → Walrus Site | Optional human-readable entrypoint |

### 14.2 Frontend Deployment

```bash
cd frontend && pnpm build
site-builder deploy ./dist --epochs 52
```

For subsequent frontend releases, `site-builder deploy ./dist` uploads only changed assets and reuses the existing site object.

### 14.3 Backend Deployment

```bash
# docker-compose.yml handles Postgres + indexer + graphql
docker compose up -d
```

GitHub Actions CI/CD: on push to main, build frontend → deploy to Walrus Sites; build indexer + graphql containers → deploy to hosting.
