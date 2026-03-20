# Walrus AI Policy Archive — Data Model

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
    quilt_patch_id: String,    // Walrus quilt patch ID — every upload uses the quilt format
    mime_type: String,
    size_bytes: u64,
    description: String,
}
```

**`quilt_patch_id`:** Every upload — initial submission (N files) or a single-file update — uses the Walrus quilt format. The SDK returns a `quilt_patch_id` per file. This is the stable retrieval reference regardless of how many files were in the upload batch.

**Download URL:**

| Case | URL pattern |
|---|---|
| Any file | `https://{aggregator}/v1/blobs/by-quilt-patch-id/{quiltPatchId}` |

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
| `FileUpserted` | `upsert_file()` | artifact ID, path, quilt_patch_id, mime_type, size_bytes, description |
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

CREATE TABLE artifact_file (
    id              BIGSERIAL PRIMARY KEY,
    artifact_id     TEXT     NOT NULL REFERENCES artifact(sui_object_id),
    path            TEXT     NOT NULL,
    quilt_patch_id  TEXT     NOT NULL,
    mime_type       TEXT     NOT NULL,
    size_bytes      BIGINT   NOT NULL,
    description     TEXT     NOT NULL DEFAULT '',
    UNIQUE (artifact_id, path)
);

CREATE INDEX ON artifact_file(artifact_id);
```

---

## Event → DB Mapping

| Event | DB action |
|---|---|
| `ArtifactCreated` | `INSERT` row with all metadata |
| `ArtifactUpdated` | `UPDATE` title, description, topics, categories, authors, tags, updated_epoch |
| `FileUpserted` | `INSERT INTO artifact_file ... ON CONFLICT (artifact_id, path) DO UPDATE` + `UPDATE artifact SET file_count = file_count + 1` |
| `FileRemoved` | `DELETE FROM artifact_file WHERE artifact_id = ? AND path = ?` + `UPDATE artifact SET file_count = file_count - 1` |

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
  Browser → GraphQL API → PostgreSQL (listings, search, filters, artifact detail + file list)
         → Walrus aggregator (file download by quilt patch ID)
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
