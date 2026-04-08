# Walrus Archive & Governance Archive — Product Requirements

**Status:** Draft
**Date:** 2026-03-20
**Scope:** Web platform for publishing, preserving, and discovering AI policy research artifacts on Walrus decentralized storage.

---

## 1. Problem

AI governance knowledge is produced at scale but stored ephemerally. The structural failure modes:

- **Link rot** — hosted documents disappear when institutions restructure or defund projects
- **Version ambiguity** — reports are silently updated without versioning, making citation unreliable
- **Missing provenance chain** — published conclusions exist but underlying data, code, and analysis do not
- **No neutral home** — knowledge is trapped in organization-controlled storage with no independent durability guarantee

Researchers cannot reproduce analysis. Policymakers cannot trace where ideas came from.

---

## 2. Solution

An **artifact preservation layer** with a discovery interface — not a document CMS.

**Core design principle:** Sui holds live metadata and file pointers; Walrus holds file content.

The `Artifact` Sui object is the source of truth for structured metadata. Its dynamic fields map each file path to the Walrus blob ID of that file's content. File content on Walrus is immutable and content-addressed. Metadata on Sui is updatable by the owner — enabling corrections without replacing the entire submission.

If the interface disappears, every file is still retrievable by blob ID from any Walrus aggregator. The Artifact Sui object is independently verifiable on-chain with no dependency on any application server.

A **policy artifact** is the unit of contribution: a structured collection of files representing a research or policy output — not just the final report, but the full evidence chain behind it.

---

## 3. Users

| Persona | Goal | Key flow |
|---|---|---|
| **Contributor** (researcher, think tank analyst) | Publish and preserve research artifacts with full provenance | Submission flow |
| **Consumer** (policymaker, journalist, citizen) | Find, read, and download policy artifacts | Discovery interface |
| **Verifier** (researcher, auditor) | Independently confirm an artifact's integrity and provenance | Read Artifact Sui object → fetch files from Walrus aggregator by blob ID |
| **Sponsor** (institution, foundation, individual) | Fund storage extension for important artifacts | Storage extension UI (Phase 3) |

---

## 4. Scope

### In Scope
- Web-based submission flow (upload files + structured metadata)
- Walrus storage integration for all artifact files
- Custom Sui Move package (`walrus_archive`) — `Artifact` shared object as the on-chain registry
- Custom Rust indexer subscribing to contract events → PostgreSQL
- GraphQL API server for discovery queries
- Public discovery interface (browse, search, filter)
- Artifact detail pages (file list, download, on-chain verification)
- Walrus Sites deployment for the frontend

### Out of Scope
- CLI tooling
- User authentication / accounts (v1 uses wallet-based signing)
- Comments, annotations, or social features
- Automated ingestion of external repositories

---

## 5. Storage Layer (Walrus)

### Key Constraints

- **Blob ID**: content-addressed — same file always produces the same ID; re-uploading an identical file returns the existing certified blob
- **Certified blob**: durably stored once the `certify` transaction succeeds on Sui; the `Blob` Sui object is the on-chain Proof of Availability
- **Storage epochs**: 2-week epoch duration on mainnet; maximum single purchase: 53 epochs (~2 years); payment in WAL tokens upfront
- **Quilt format**: multiple files bundled into a single blob with per-file retrievability; significantly cheaper per file than individual blob uploads

### v1 Storage Policy

- All artifact files are uploaded as a **Quilt** on initial submission
- Storage purchased: **52 epochs minimum** (~2 years) at submission time
- When a single file is updated, only that file is re-uploaded; the dynamic field pointer on the Artifact object is updated; unchanged files remain on the original quilt
- UI surfaces epoch countdown per artifact; warns at ≤4 epochs (~8 weeks) to expiry

---

## 6. Data Model

### Artifact Object

An `Artifact` is a **shared** Sui object. Metadata lives on Sui (updatable by `ROLE_ADMIN`). File content lives on Walrus (immutable). Dynamic fields map file paths to quilt patch IDs — the same pattern used by Walrus Sites. Access control roles are also stored as dynamic fields on the root object.

| Field | Type | Notes |
|---|---|---|
| `suiObjectId` | string | Permanent identifier |
| `creator` | address | Address that created this artifact/commit |
| `title` | string | |
| `description` | string | |
| `topics` | PolicyTopic[] | From v1 taxonomy |
| `categories` | string[] | |
| `authors` | Author[] | name, optional ORCID, optional affiliation |
| `institution` | string | |
| `publishedDate` | ISO 8601 | |
| `license` | string | SPDX identifier or custom |
| `tags` | string[] | |
| `rootId` | string? | Root artifact's ID; null if this IS the root |
| `parentId` | string? | Direct parent's ID; null if this IS the root |
| `createdAt` | u64 | Unix ms via Clock |
| `files` | dynamic fields | `path → FileRef` |

**FileRef** (per file): `quiltPatchId`, `blobId`, `endEpoch`, `mimeType`, `sizeBytes`, `description`

- `quiltPatchId` — retrieval key; download URL: `https://{aggregator}/v1/blobs/by-quilt-patch-id/{quiltPatchId}`
- `blobId` — links the file to its Walrus Blob DOF on the Artifact; used as the key for `extend_blob` calls
- `endEpoch` — storage expiration epoch; surfaced in the UI as an estimated date with a warning at ≤4 epochs
- `sizeBytes` — per-file unencoded size from the SDK quilt patch response (not derived from `blob.size()`, which is the whole quilt)

### Policy Topic Taxonomy (v1)

`ai_safety` · `ai_governance_frameworks` · `labor_markets` · `economic_policy` · `regulatory_proposals` · `international_coordination` · `technical_standards` · `civil_society` · `national_strategies` · `risk_assessment`

### Data Responsibility Split

| Data | Where | Why |
|---|---|---|
| Metadata fields | Artifact Sui object | Structured, queryable, updatable |
| `created_at` | Artifact Sui object | Trustless timestamp (Clock ms) |
| `root_id`, `parent_id` | Artifact Sui object | Tree lineage, independently verifiable |
| Access control roles (`address → u8`) | Root artifact dynamic fields | On-chain, auditable |
| File path → quilt_patch_id + blob_id + end_epoch mapping | Artifact dynamic fields | Same pattern as Walrus Sites; blob_id links to Blob DOF |
| Walrus Blob objects (proof of storage) | Artifact dynamic object fields (DOF) | Keyed by blob_id; enables on-chain extension by anyone |
| File bytes | Walrus blobs | Pure storage; retrieved by quilt_patch_id |

### Updates and Versioning

Artifacts form a tree. The root is created with `create_artifact`. Each new version is a commit via `commit_artifact`, which creates a new Artifact object under the same root — independently citable by its own `suiObjectId`.

| Change | Action | Wallet confirmation dialogs |
|---|---|---|
| Title, description, topics, authors | `update_metadata` tx (in-place) | 0 (Enoki auto-signs) |
| One file content | Upload quilt + `upsert_file` tx | 0 (Enoki auto-signs; WAL required) |
| Add a new file | Upload quilt + `upsert_file` tx | 0 (Enoki auto-signs; WAL required) |
| Remove a file | `remove_file` tx | 0 (Enoki auto-signs) |
| New independently-citable version | `commit_artifact(root, parent)` + files | 0 (Enoki auto-signs; WAL required) |

---

## 7. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     User (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Discovery SPA│  │ Submission   │                       │
│  └──────┬───────┘  └──────┬───────┘                       │
└─────────┼─────────────────┼───────────────────────────────┘
          │ GraphQL          │ 1. Walrus SDK (upload files as quilt)
          │ queries          │ 2. Sui PTB: create_artifact() + upsert_file() × N
   ┌──────▼──────┐    ┌──────▼──────┐    ┌──────────────┐
   │  GraphQL    │    │  Walrus     │    │  Sui         │
   │  API Server │    │  Storage    │    │  Fullnode    │
   └──────┬──────┘    │  Network    │    └──────┬───────┘
          │           └─────────────┘           │
          │                              ArtifactCreated event
   ┌──────▼──────┐                              │
   │ PostgreSQL  │◄─────────────────────────────┘
   └──────▲──────┘     checkpoint stream
          │
   ┌──────┴──────┐
   │  Custom     │
   │  Indexer    │
   │  (Rust)     │
   └─────────────┘
```

**Components:**

- **Walrus Storage Network** — Pure blob storage. No application logic. File content certified here.
- **Artifact Move Contract** (`walrus_archive::artifact`) — Defines `Artifact` shared object with metadata fields, dynamic file references, and role-based access control. Emits `ArtifactEvent`, `ArtifactUpdated`, `FileUpserted`, `FileRemoved` events.
- **Custom Rust indexer** — Subscribes to artifact events in the checkpoint stream. All metadata is in the event payload; no Walrus fetch required for indexing. Writes to PostgreSQL.
- **GraphQL API server** — Reads from PostgreSQL. Serves paginated, filtered, searchable artifact queries.
- **Frontend SPA** — Deployed as a Walrus Site. Queries GraphQL for discovery and artifact detail. Uses Walrus SDK for uploads.

---

## 8. Submission Flow

**Total: 2 on-chain transactions, 0 wallet confirmation dialogs.** Tx 1 registers the quilt blob on Walrus. Tx 2 is a combined PTB: certify the blob + create/commit artifact + upsert files. Enoki handles authentication via zkLogin (OAuth) and signs all transactions automatically without user approval prompts. WAL tokens must be present in the zkLogin-derived wallet for Walrus storage payment; SUI gas fees can be sponsored via the Enoki backend API.

### Authentication Model (Enoki)

Enoki is a Mysten Labs SDK (`@mysten/enoki`) that wraps zkLogin — Sui's zero-knowledge proof-based authentication. Users log in with Google or Apple OAuth; Enoki derives a non-custodial, self-custodial Sui address from the OAuth credential via zk-proof without exposing the identity link on-chain. The key technical behavior that eliminates wallet popups: once authenticated, Enoki signs all Sui transactions via short-lived ephemeral key pairs without showing any confirmation modal — unlike traditional wallets (Sui Wallet, MetaMask) which prompt for every approval.

Enoki integrates with the existing `@mysten/dapp-kit` setup: call `registerEnokiWallets({ apiKey, providers: { google, apple }, client })` before rendering the `WalletProvider`, then use the standard `useSignAndExecuteTransaction` hook from dapp-kit. No changes to the rest of the transaction construction logic.

**Gas sponsorship** — the Sui PTB step (create_artifact) can be sponsored via Enoki's backend sponsorship API (private API key + server-side relay required). WAL token payments for Walrus storage are not sponsorable through Enoki; the user's zkLogin wallet must hold sufficient WAL.

1. **OAuth login** — Enoki opens an OAuth popup (Google or Apple). zkLogin derives a non-custodial Sui address from the credential. Session valid until ephemeral key expires (~24h); re-authentication is silent unless session expires. Check WAL balance; warn if insufficient.
2. **Fill metadata + select files** — Title, description, authors, institution, publication date, license (SPDX selector), topics (multi-select), files with per-file descriptions. Client-side validation on file type and size.
3. **Upload to Walrus** — SDK encodes and registers files as a quilt (**Tx 1: register**). Off-chain shard upload follows. SDK returns a `quiltPatchId` and `sizeBytes` per file, plus the quilt's `blobId`. Enoki auto-signs silently. WAL payment executes automatically from the zkLogin wallet.
4. **Create Artifact on Sui** — **Tx 2 (combined PTB)**: `certify_blob` (Walrus) + `create_artifact(blob)` + `upsert_file()` × N in one transaction. The Blob object is wrapped as a DOF on the Artifact inside this same tx. Enoki auto-signs silently. SUI gas fee can be sponsored via Enoki backend (optional). Emits events. Artifact discoverable via GraphQL within seconds. **Total: 2 wallet interactions.**
5. **Confirmation** — Artifact `suiObjectId`, Sui transaction digest, permalink, per-file download URLs.

### File Constraints (v1)

- Maximum individual file size: **100 MiB**
- Maximum files per artifact: **50**
- Accepted types: PDF, CSV, JSON, XLSX, ZIP, TXT, MD, PNG, JPEG, Python/R scripts
- Storage purchased: **52 epochs minimum**

### Cost Estimation

Before submission the UI displays: total bytes, estimated WAL cost (`total_bytes × storage_price × epochs`), current WAL/USD rate (informational).

---

## 9. Discovery Interface

The SPA is served as a Walrus Site. Artifact listings come from the GraphQL API. Artifact detail reads the Artifact Sui object via RPC. File downloads go directly to the Walrus aggregator.

### Pages

**Browse** — Paginated list of recent submissions. Filter sidebar: topics, date range, institution. Full-text search over title + institution (`tsvector`). Sort: newest, oldest.

**Artifact Detail** — Full metadata, file list with sizes and MIME types, per-file download buttons (direct Walrus aggregator URL by quilt patch ID), on-chain record (Sui transaction link, `suiObjectId`), epoch expiry indicator (estimated date derived from `endEpoch`; warning badge at ≤4 epochs remaining), "Extend Storage" button (Phase 3).

**About** — How the archive works.

---

## 10. On-Chain Contract

### Move Package: `walrus_archive`

**Structs:** `Artifact` (key) — shared object; `creator`, metadata fields, `root_id`, `parent_id`, `created_at`. `Author` (store, copy, drop) — `name`, `orcid?`, `affiliation?`. `FilePath` — dynamic field key. `FileRef` — dynamic field value: `quilt_patch_id`, `blob_id`, `end_epoch`, `mime_type`, `size_bytes`, `description`. Walrus `Blob` objects stored as dynamic object fields (DOF) on the Artifact, keyed by `blob_id: u256`.

**Access control:** Role constants (`ROLE_ADMIN = 1`) stored as `address → u8` dynamic fields on the root Artifact. `create_artifact` auto-assigns `ROLE_ADMIN` to the creator. `add_contributor` / `remove_contributor` manage roles; all mutating entry points require `ROLE_ADMIN`. `extend_blob` requires no role — open to anyone.

**Entry points:**
- `create_artifact(blob: Blob, title, description, topics, categories, authors, institution, published_date, license, tags, clock, ctx)` → shares Artifact, wraps blob as DOF, emits `ArtifactEvent`
- `commit_artifact(blob: Blob, root, parent, title, description, topics, categories, authors, institution, published_date, license, tags, clock, ctx)` → shares new Artifact under same root, wraps blob as DOF, emits `ArtifactEvent`
- `upsert_file(artifact, blob: Blob, path, quilt_patch_id, mime_type, size_bytes, description, ctx)` → wraps blob as DOF (keyed by `blob.blob_id()`), stores `end_epoch` from `blob.end_epoch()`, emits `FileUpserted`
- `extend_blob(artifact, blob_id, system, payment, epochs)` → borrows Blob DOF mutably, calls `system.extend_blob`; open to anyone
- `remove_file(artifact, path, ctx)` → emits `FileRemoved`
- `update_metadata(artifact, title, description, topics, categories, authors, tags, ctx)` → emits `ArtifactUpdated`
- `add_contributor(root, contributor, role, ctx)` — ROLE_ADMIN only
- `remove_contributor(root, contributor, ctx)` — ROLE_ADMIN only

**Events** carry the full metadata payload — the indexer reads events only, never fetches from Walrus.

### Indexer Event Processing

1. `ArtifactEvent` (root_id null) → insert `artifact` row — new root
2. `ArtifactEvent` (root_id set) → insert `artifact` row — new commit
3. `ArtifactUpdated` → update `artifact` row
4. `FileUpserted` → upsert `walrus_quilt(blob_id, end_epoch)` + upsert `artifact_file` row; increment `artifact.file_count`
5. `FileRemoved` → delete `artifact_file` row; decrement `artifact.file_count`
6. `BlobExtended` (emitted by `extend_blob`) → update `walrus_quilt SET end_epoch = ...`

Re-indexing replays the Sui checkpoint event stream — deterministic and auditable.

### Contract Upgrade Path

Artifact objects survive package upgrades (stable field layouts). In v1, the package is owned by a multisig controlled by the archive team. Upgrades may add entrypoints but cannot remove `create_artifact`, `upsert_file`, or `update_metadata`.

---

## 11. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend framework** | Vite + React | Fast builds, native WASM support, static output compatible with Walrus Sites |
| **Wallet integration** | `@mysten/dapp-kit` | Official Sui React hooks; Enoki wallets register via `registerEnokiWallets()` and surface through the standard `useSignAndExecuteTransaction` hook |
| **Authentication / signing** | `@mysten/enoki` | zkLogin OAuth authentication (Google, Apple); derives non-custodial Sui address; auto-signs all transactions without confirmation dialogs; optional gas sponsorship via private API key + backend relay |
| **Sui SDK** | `@mysten/sui` | Official TypeScript SDK for PTB construction and RPC |
| **Walrus SDK** | `@mysten/walrus` | Official SDK; handles full write flow (encode, register, upload, certify) |
| **Styling** | Tailwind CSS | Standard, no runtime overhead |
| **Site deployment** | `site-builder` CLI | Official Walrus Sites tooling |
| **Indexer** | `sui-indexer-alt-framework` (Rust) | Official Sui framework for checkpoint-based indexers |
| **Database** | PostgreSQL + Diesel ORM | Framework's native store; proven for structured metadata queries |
| **GraphQL server** | `async-graphql` (Rust) | Lightweight; reads from the same Postgres the indexer writes to |
| **On-chain registry** | Custom Move package `walrus_archive` | `Artifact` shared object — updatable metadata, dynamic file references, role-based access control, event emission |

---

## 12. Funding Model

Storage on Walrus is paid upfront in WAL tokens. Maximum single purchase: ~2 years (53 epochs).

**v1 — Submitter pays.** The submitter's wallet covers the WAL cost at upload time. The UI shows cost breakdown before submission.

**Phase 3 — Storage extension.** Any wallet can fund additional epochs for any artifact by calling `extend_blob` on-chain — no permission required since the Artifact is shared and the Blob lives as a DOF on it. Sources: submitting institution, community sponsorship, foundation grants. The artifact detail page surfaces an "Extend Storage" action with epoch amount input and estimated WAL cost. Extension updates `end_epoch` on the Blob DOF and the indexer picks up the change via the emitted event.

---

## 13. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **GraphQL listing latency** | p95 < 500ms for 20-item paginated query |
| **Indexer lag** | Artifact discoverable within 10 seconds of Sui transaction confirmation |
| **Submission end-to-end** | Walrus upload + Sui PTB confirmation < 60s for ≤10 files at ≤10 MiB each |
| **File download** | Direct Walrus aggregator fetch — no platform SLA (decentralized retrieval) |
| **GraphQL availability** | 99.5% monthly uptime |
| **Rate limiting** | 100 requests/minute per IP; enforced at reverse proxy in v1 |
| **Frontend bundle** | Initial load < 200 KiB compressed |
