# Walrus AI Policy Archive — Data Model

**Audience:** Engineering leads, new contributors
**Date:** 2026-03-20

---

## Core Principle

Data is split across two systems by purpose:

| System | What lives there | Why |
|---|---|---|
| **Sui blockchain** | Structured metadata + file path → blob ID mappings | Trustless, updatable, independently verifiable |
| **Walrus storage** | Raw file bytes | Immutable, content-addressed, decentralized |

PostgreSQL is a **derived cache** — fully rebuildable by replaying Sui events. It exists only to serve fast discovery queries.

---

## On-Chain: The `Artifact` Object

An `Artifact` is a Sui owned object. The submitter's wallet owns it.

```move
public struct Artifact has key, store {
    id: UID,
    owner: address,

    // Core metadata (updatable by owner)
    title: String,
    description: String,
    topics: vector<String>,       // from v1 taxonomy (e.g. "ai_safety")
    categories: vector<String>,
    authors: vector<Author>,
    institution: String,
    published_date: String,       // ISO 8601, e.g. "2025-03"
    license: String,              // SPDX identifier or custom
    tags: vector<String>,

    // Versioning
    revision_of: Option<ID>,      // suiObjectId of predecessor, if a revision

    // Chain timestamps (trustless, not editable)
    created_epoch: u64,
    updated_epoch: u64,
}

public struct Author has store, copy, drop {
    name: String,
    orcid: Option<String>,
    affiliation: Option<String>,
}
```

---

## On-Chain: File References (Dynamic Fields)

Files are stored as **dynamic fields** on the Artifact object — the same pattern Walrus Sites uses. The field key is a file path; the value points to the Walrus blob.

```move
public struct FilePath has copy, drop, store { path: String }  // field key

public struct FileRef has store {                               // field value
    blob_id: String,
    quilt_id: Option<String>,  // set when file is part of a multi-file quilt upload
    mime_type: String,
    size_bytes: u64,
    description: String,
}
```

**`quilt_id` logic:** On initial submission, all files are bundled into a single Walrus quilt (cheaper than individual uploads). `quilt_id` is set to the quilt's blob ID for those files. If a single file is later updated in-place, it's re-uploaded as a standalone blob — `quilt_id` is `None`.

**Download URL by case:**

| Case | URL pattern |
|---|---|
| File in quilt | `https://{aggregator}/v1/blobs/by-quilt-id/{quiltBlobId}/{path}` |
| Standalone re-upload | `https://{aggregator}/v1/blobs/{blobId}` |

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
| `ArtifactCreated` | `create_artifact()` | All metadata fields |
| `ArtifactUpdated` | `update_metadata()` | title, description, topics, categories, authors, tags |
| `FileUpserted` | `upsert_file()` | artifact ID, path, blob_id, quilt_id, mime_type, size_bytes |
| `FileRemoved` | `remove_file()` | artifact ID, path |

---

## Off-Chain: PostgreSQL Schema

A denormalized read model derived from the event stream. Each row is one artifact.

```sql
CREATE TABLE artifact (
    sui_object_id   TEXT     PRIMARY KEY,
    owner           TEXT     NOT NULL,

    title           TEXT     NOT NULL,
    description     TEXT     NOT NULL,
    topics          TEXT[]   NOT NULL,
    categories      TEXT[]   NOT NULL DEFAULT '{}',
    authors         JSONB    NOT NULL DEFAULT '[]',  -- [{"name","orcid","affiliation"}]
    institution     TEXT     NOT NULL,
    published_date  TEXT     NOT NULL,
    license         TEXT     NOT NULL,
    tags            TEXT[]   NOT NULL,

    revision_of     TEXT,                            -- NULL if original
    created_epoch   BIGINT   NOT NULL,
    updated_epoch   BIGINT   NOT NULL,
    file_count      INT      NOT NULL DEFAULT 0      -- maintained by FileUpserted/FileRemoved
);

-- Indexes for common query patterns
CREATE INDEX ON artifact USING GIN(topics);
CREATE INDEX ON artifact USING GIN(categories);
CREATE INDEX ON artifact(created_epoch DESC);
CREATE INDEX ON artifact(published_date DESC);
CREATE INDEX ON artifact(revision_of);
CREATE INDEX ON artifact USING GIN(
    to_tsvector('english', title || ' ' || institution || ' ' || description)
);
```

**Note:** File-level detail (individual blob IDs, paths, sizes) is **not** stored in Postgres. It's fetched live from Sui RPC when a user opens an artifact detail page. Postgres only tracks `file_count` for listings.

---

## Event → DB Mapping

| Event | DB action |
|---|---|
| `ArtifactCreated` | `INSERT` row with all metadata |
| `ArtifactUpdated` | `UPDATE` title, description, topics, categories, authors, tags, updated_epoch |
| `FileUpserted` | `UPDATE artifact SET file_count = file_count + 1` |
| `FileRemoved` | `UPDATE artifact SET file_count = file_count - 1` |

---

## Versioning Model

| Change type | How it's handled |
|---|---|
| Minor correction (title, description, authors) | `update_metadata()` tx — mutates the existing Artifact in place |
| File content update | `upsert_file()` tx — new blob uploaded, dynamic field pointer updated; old blob persists on Walrus |
| Major revision (independently citable v2) | New Artifact object created with `revision_of` pointing to predecessor |

Both old and new Artifact objects remain permanently accessible on-chain.

---

## Data Flow Summary

```
Submission:
  Browser → Walrus SDK (upload files as quilt) → blob IDs
          → Sui PTB: create_artifact() + upsert_file() × N
          → ArtifactCreated + FileUpserted events emitted

Indexing:
  Sui checkpoint stream → Indexer (Rust) → PostgreSQL

Discovery:
  Browser → GraphQL API → PostgreSQL (listings, search, filters)
         → Sui RPC (full Artifact object + dynamic file fields, on detail page)
         → Walrus aggregator (file download by blob ID)
```

---

## Independent Verification (No App Required)

Because all data lives on public infrastructure:

```bash
# 1. Read the Artifact object directly from any Sui node
sui client object <suiObjectId>

# 2. Download any file from any Walrus aggregator
curl https://{aggregator}/v1/blobs/{blobId}
```

No dependency on the indexer, GraphQL server, or this application.
