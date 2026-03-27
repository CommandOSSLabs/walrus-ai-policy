# Walrus Archive — Data Model

**Audience:** Engineering leads, new contributors
**Date:** 2026-03-20

---

## Core Principle

Data is split across two systems by purpose:

| System | What lives there | Why |
|---|---|---|
| **Sui blockchain** | Structured metadata + file path → quilt patch ID mappings | Trustless, updatable, independently verifiable |
| **Walrus storage** | Raw file bytes | Immutable, content-addressed, decentralized |

PostgreSQL is a **derived cache** — fully rebuildable by replaying Sui events. It exists only to serve fast discovery queries.

---

## On-Chain: The `Artifact` Object

An `Artifact` is a **shared** Sui object (accessible by any transaction). The creator's address is recorded on-chain but does not imply exclusive ownership; access control is managed by role dynamic fields (see below).

```move
module walrus_ai_policy::artifact;

public struct Artifact has key {
    id: UID,
    creator: address,

    // Core metadata (updatable by ROLE_ADMIN)
    title: String,
    description: String,
    topics: vector<String>,       // from v1 taxonomy (e.g. "ai_safety")
    categories: vector<String>,
    authors: vector<Author>,
    published_date: String,       // ISO 8601, e.g. "2025-03"

    // Versioning — tree structure
    root_id: Option<ID>,          // None for root artifacts; root's ID for all commits
    parent_id: Option<ID>,        // None for root artifacts; direct parent's ID for commits

    // Chain timestamp (trustless, not editable)
    created_at: u64,              // Unix ms via Clock
}

public struct Author has store, copy, drop {
    name: String,
    orcid: Option<String>,
    affiliation: Option<String>,
}
```

---

## On-Chain: Access Control (Dynamic Fields)

Roles are stored as dynamic fields on the **root** Artifact object only: key = `address`, value = `u8` role constant.

```move
const ROLE_ADMIN: u8 = 1;
```

| Role | Grants |
|---|---|
| `ROLE_ADMIN` | `commit_artifact`, `update_metadata`, `upsert_file`, `remove_file`, `add_contributor` |

`create_artifact` automatically adds the creator's address as `ROLE_ADMIN` on the new root. All role checks on commits are validated against the root object's dynamic fields.

---

## On-Chain: File References (Dynamic Fields)

Files are stored as **dynamic fields** on the Artifact object — the same pattern Walrus Sites uses. The field key is a file path; the value points to the Walrus blob.

```move
public struct FilePath has copy, drop, store { path: String }  // field key

public struct FileRef has store {                               // field value
    quilt_patch_id: String,    // retrieval key — fetch via aggregator URL
    blob_id: u256,             // key into the Blob DOF (see below); links to walrus_quilt
    end_epoch: u32,            // storage expiration epoch — for display and extend calls
    mime_type: String,
    size_bytes: u64,           // per-file unencoded size from SDK quilt patch response
    description: String,
}
```

**`quilt_patch_id`:** Every upload uses the Walrus quilt format. The SDK returns a `quilt_patch_id` per file — the stable retrieval reference regardless of batch size.

**Download URL:**

| Case | URL pattern |
|---|---|
| Any file | `https://{aggregator}/v1/blobs/by-quilt-patch-id/{quiltPatchId}` |

---

## On-Chain: Blob Storage (Dynamic Object Fields)

Each Walrus `Blob` object (`has key, store`) is attached to the Artifact using `dynamic_object_field::add`, keyed by `blob_id: u256`. Because `Blob` is a Sui object, it must use DOF (not a plain dynamic field) — this preserves its on-chain identity and allows it to be borrowed mutably for extension. This enables trustless storage extension by anyone — no role check required since Artifact is a shared object.

```move
// On upload: blob taken by value and wrapped as DOF
dynamic_object_field::add(&mut artifact.id, blob.blob_id(), blob);

// Anyone can extend — open to contributors, institutions, or community sponsors
public fun extend_blob(
    artifact: &mut Artifact,
    blob_id: u256,
    system: &mut walrus::system::System,
    payment: &mut Coin<WAL>,
    epochs: u32,
) {
    let blob = dynamic_object_field::borrow_mut<u256, Blob>(&mut artifact.id, blob_id);
    system.extend_blob(blob, epochs, payment);
}
```

Multiple quilts accumulate over time — initial submission and each per-file update produce a new quilt blob, each stored under its own `blob_id` key. `FileRef.blob_id` is the lookup key connecting a file to its Blob DOF.

---

## Policy Topic Taxonomy (v1)

Fixed enum stored as strings in `topics[]`:

```
ai_safety · ai_governance_frameworks · labor_markets · economic_policy
regulatory_proposals · international_coordination · technical_standards
civil_society · national_strategies · risk_assessment
```

---

## Events (Source of Truth for Indexer)

The Move contract emits events carrying the **full metadata payload**. The indexer never reads from Walrus — it only processes these events.

| Event | Trigger | Payload |
|---|---|---|
| `ArtifactEvent` | `create_artifact()` and `commit_artifact()` | id, root_id, parent_id, creator, created_at + all metadata fields |
| `ArtifactUpdated` | `update_metadata()` | artifact ID, title, description, topics, categories, authors, tags |
| `FileUpserted` | `upsert_file()` | artifact ID, path, quilt_patch_id, blob_id, end_epoch, mime_type, size_bytes, description |
| `FileRemoved` | `remove_file()` | artifact ID, path |

`ArtifactEvent` is shared by both entry points. The indexer distinguishes a new root (`root_id` is null) from a commit (`root_id` is set).

---

## Off-Chain: PostgreSQL Schema

A denormalized read model derived from the event stream. Each row is one artifact.

```sql
CREATE TABLE artifact (
    sui_object_id   TEXT     PRIMARY KEY,
    creator         TEXT     NOT NULL,

    title           TEXT     NOT NULL,
    description     TEXT     NOT NULL,
    topics          TEXT[]   NOT NULL,
    categories      TEXT[]   NOT NULL DEFAULT '{}',
    authors         JSONB    NOT NULL DEFAULT '[]',  -- [{"name","orcid","affiliation"}]
    institution     TEXT     NOT NULL,
    published_date  TEXT     NOT NULL,
    license         TEXT     NOT NULL,
    tags            TEXT[]   NOT NULL,

    root_id         TEXT,                            -- NULL if this is a root artifact
    parent_id       TEXT,                            -- NULL if this is a root artifact
    created_at      BIGINT   NOT NULL,               -- Unix ms from Clock
    file_count      INT      NOT NULL DEFAULT 0      -- maintained by FileUpserted/FileRemoved
);

-- Indexes for common query patterns
CREATE INDEX ON artifact USING GIN(topics);
CREATE INDEX ON artifact USING GIN(categories);
CREATE INDEX ON artifact(created_at DESC);
CREATE INDEX ON artifact(published_date DESC);
CREATE INDEX ON artifact(root_id);
CREATE INDEX ON artifact(parent_id);
CREATE INDEX ON artifact USING GIN(
    to_tsvector('english', title || ' ' || institution || ' ' || description)
);

-- One row per quilt blob — tracks storage lifespan for extension
CREATE TABLE walrus_quilt (
    blob_id         TEXT     PRIMARY KEY,  -- u256 as hex; DOF key on the Artifact
    end_epoch       INT      NOT NULL      -- updated whenever extend_blob is called
);

CREATE TABLE artifact_file (
    id              BIGSERIAL PRIMARY KEY,
    artifact_id     TEXT     NOT NULL REFERENCES artifact(sui_object_id),
    path            TEXT     NOT NULL,
    quilt_patch_id  TEXT     NOT NULL,
    blob_id         TEXT     NOT NULL REFERENCES walrus_quilt(blob_id),
    mime_type       TEXT     NOT NULL,
    size_bytes      BIGINT   NOT NULL,
    description     TEXT     NOT NULL DEFAULT '',
    UNIQUE (artifact_id, path)
);

CREATE INDEX ON artifact_file(artifact_id);
CREATE INDEX ON artifact_file(blob_id);
```

---

## Event → DB Mapping

| Event | DB action |
|---|---|
| `ArtifactEvent` (root_id null) | `INSERT` artifact row — new root |
| `ArtifactEvent` (root_id set) | `INSERT` artifact row — new commit under root |
| `ArtifactUpdated` | `UPDATE` title, description, topics, categories, authors, tags |
| `FileUpserted` | `UPSERT walrus_quilt(blob_id, end_epoch)` + `INSERT INTO artifact_file ... ON CONFLICT (artifact_id, path) DO UPDATE` + `UPDATE artifact SET file_count = file_count + 1` |
| `FileRemoved` | `DELETE FROM artifact_file WHERE artifact_id = ? AND path = ?` + `UPDATE artifact SET file_count = file_count - 1` |

---

## Versioning Model

Artifacts form a tree. Each commit is its own shared Artifact object with its own `suiObjectId`, independently accessible.

```
root (root_id=null, parent_id=null)
 ├── commit A (root_id=root, parent_id=root)
 │    └── commit B (root_id=root, parent_id=A)
 └── commit C (root_id=root, parent_id=root)
```

| Change type | How it's handled |
|---|---|
| Minor correction (title, description, authors) | `update_metadata()` tx — mutates the Artifact object in place |
| File content update | `upsert_file()` tx — new quilt patch uploaded, dynamic field pointer updated; old content persists on Walrus |
| New independently-citable version | `commit_artifact(root, parent, ...)` — creates a child Artifact under the same root |

`commit_artifact` validates that `parent.root_id` matches the provided root, ensuring the parent belongs to the same tree. Requires `ROLE_ADMIN` on the root object.

---

## Data Flow Summary

```
Submission:
  Browser → Walrus SDK (upload files as quilt)
          → Tx 1: register blob on Walrus  (reserve_space + register_blob)
          [off-chain: shard upload to storage nodes]
          → Tx 2 (combined PTB):
              certify_blob(&mut blob, ...)              ← Walrus
              create_artifact(blob, ...) + upsert_file() × N   ← our contract [new root]
              OR commit_artifact(blob, root, parent) + upsert_file() × N  [new version]
          → ArtifactEvent + FileUpserted events emitted
          (blob wrapped as DOF on Artifact inside Tx 2)

Indexing:
  Sui checkpoint stream → Indexer (Rust)
    FileUpserted → UPSERT walrus_quilt(blob_id, end_epoch) + INSERT artifact_file
    → PostgreSQL

Discovery:
  Browser → GraphQL API → PostgreSQL (listings, search, filters, artifact detail + file list)
         → Walrus aggregator (file download by quilt patch ID)

Extension:
  Browser → extend_blob(artifact, blob_id, system, payment, epochs)  ← anyone can call
          → BlobCertified event with updated end_epoch
          → Indexer → UPDATE walrus_quilt SET end_epoch = ...
```

---

## Independent Verification (No App Required)

Because all data lives on public infrastructure:

```bash
# 1. Read the Artifact object directly from any Sui node
sui client object <suiObjectId>

# 2. Download any file from any Walrus aggregator by quilt patch ID
curl https://{aggregator}/v1/blobs/by-quilt-patch-id/{quiltPatchId}
```

No dependency on the indexer, GraphQL server, or this application.
