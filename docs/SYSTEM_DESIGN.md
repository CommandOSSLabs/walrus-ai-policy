# Walrus AI Policy & Governance Archive — System Design

**Source PRD:** `docs/PRD.md`
**Date:** 2026-03-20

---

## 1. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │ Discovery SPA│  │ Submission   │                      │
│  └──────┬───────┘  └──────┬───────┘                      │
└─────────┼─────────────────┼────────────────────────────--┘
          │ GraphQL          │ 1. Walrus SDK (quilt upload)
          │ queries          │ 2. Sui PTB: create_artifact + upsert_file × N
   ┌──────▼──────┐    ┌──────▼──────┐    ┌──────────────┐
   │  GraphQL    │    │   Walrus    │    │     Sui      │
   │  API Server │    │   Storage   │    │   Fullnode   │
   └──────┬──────┘    └─────────────┘    └──────┬───────┘
          │                                      │
   ┌──────▼──────┐                 ArtifactCreated / ArtifactUpdated /
   │ PostgreSQL  │◄────────────────FileUpserted events (checkpoint stream)
   └──────▲──────┘
          │
   ┌──────┴──────┐
   │   Indexer   │
   │   (Rust)    │
   └─────────────┘
```

**Failure modes:**

| Dependency | Impact |
|---|---|
| Walrus Storage Network | Submissions blocked; existing blobs unaffected |
| Sui Fullnode | Indexer pauses (resumes on reconnect); submissions blocked |
| PostgreSQL | Browse/search unavailable; artifacts still readable via Sui RPC + Walrus aggregator by blob ID |
| GraphQL Server | Browse/search unavailable; direct Artifact access via `suiObjectId` still works |

---

## 2. Move Contract

Package: `walrus_archive::artifact`

Structs, entry points, events, and upgrade policy: see `docs/DATA_MODEL.md`.

---

## 3. Indexer

Built on `sui-indexer-alt-framework`. Subscribes to `walrus_archive::artifact` events via the Sui checkpoint stream.

PostgreSQL schema, event → DB mapping, and indexing rationale: see `docs/DATA_MODEL.md`.

Postgres is a derived view — fully rebuildable by replaying the checkpoint event stream from genesis.

```bash
archive-indexer \
  --remote-store-url https://checkpoints.testnet.sui.io \
  --database-url postgres://user:pass@localhost/archive
```

---

## 4. GraphQL API

Rust binary (`async-graphql` + `axum`). Reads from PostgreSQL. Serves discovery queries only.

```graphql
type Query {
  artifacts(
    topics: [String!], search: String, institution: String,
    publishedDateFrom: String, publishedDateTo: String,
    limit: Int = 20, offset: Int = 0, sort: SortField = CREATED_EPOCH_DESC
  ): ArtifactConnection!

  artifact(suiObjectId: String!): ArtifactSummary
}

type ArtifactConnection { items: [ArtifactSummary!]!, totalCount: Int! }

type ArtifactSummary {
  suiObjectId: String!, title: String!, description: String!,
  institution: String!, topics: [String!]!, publishedDate: String!,
  createdEpoch: Int!, fileCount: Int!, revisionOf: String
}

# Artifact detail (full object with file list) is fetched via Sui RPC, not GraphQL.

enum SortField { CREATED_EPOCH_DESC, CREATED_EPOCH_ASC, PUBLISHED_DATE_DESC, PUBLISHED_DATE_ASC }
```

Artifact detail fetches the full Artifact object (including dynamic file fields) via Sui RPC — GraphQL serves discovery only. File downloads go directly to the Walrus aggregator by blob ID.

```bash
archive-graphql --database-url postgres://user:pass@localhost/archive --listen 0.0.0.0:4000
```

---

## 5. Data Flows

### Submission (0 wallet confirmation dialogs)

Enoki handles authentication via zkLogin (OAuth) and auto-signs all Sui and Walrus transactions. See PRD §8 for the full Enoki/zkLogin model and gas sponsorship details.

1. **OAuth login** — Enoki opens an OAuth popup (Google or Apple). zkLogin derives a non-custodial Sui address. Check WAL balance; warn if insufficient.
2. **Fill metadata + select files** — Client validates: ≤50 files, ≤100 MiB per file, accepted MIME types.
3. **Upload to Walrus** — SDK encodes, registers, uploads, and certifies all files as a quilt. Enoki auto-signs silently. WAL storage payment executes automatically from the zkLogin wallet.
4. **Create Artifact on Sui** — PTB: `create_artifact()` + `upsert_file()` × N in one transaction. Enoki auto-signs silently. Artifact discoverable via GraphQL within ~10 seconds.
5. Return `suiObjectId`, transaction digest, and per-file download URLs.

### Discovery

1. SPA queries GraphQL for listings (browse, filter by topic/date, full-text search).
2. Artifact detail: GraphQL summary + Sui RPC for full Artifact object with dynamic file fields.
3. Downloads: direct GET to Walrus aggregator by blob ID — no proxy.

### Independent Verification

1. Read the Artifact Sui object by `suiObjectId` via any Sui RPC node.
2. Fetch each file from any Walrus aggregator by `blobId` from dynamic fields.

No dependency on the indexer, GraphQL server, or this application.

---

## 6. File Download URLs

Download URL patterns by blob type: see `docs/DATA_MODEL.md` ("File References" section).

---

## 7. Project Structure

```
walrus-ai-policy/
├── docs/
│   ├── PRD.md
│   ├── SYSTEM_DESIGN.md
│   ├── DATA_MODEL.md
│   └── DESIGN_SYSTEM.md
│
├── contract/                      # Sui Move package
│   ├── Move.toml
│   ├── Move.lock
│   └── sources/artifact.move
│
├── frontend/                      # Vite + React — deployed as Walrus Site
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       # Rust workspace
│   ├── Cargo.toml
│   ├── Cargo.lock
│   ├── db/                        # Shared Diesel models + migrations
│   ├── indexer/                   # sui-indexer-alt-framework
│   │   └── src/
│   └── graphql/                   # async-graphql + axum
│       └── src/
│
└── docker-compose.yml             # Postgres + indexer + graphql for local dev
```

---

## 8. Configuration

```bash
# frontend/.env
VITE_NETWORK=testnet
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_GRAPHQL_URL=https://api.aipolicyarchive.app/graphql
VITE_WALRUS_PACKAGE_ID=0x...        # Walrus system package on Sui
VITE_ARCHIVE_PACKAGE_ID=0x...       # walrus_archive package

# indexer + graphql
DATABASE_URL=postgres://user:pass@localhost:5432/archive
REMOTE_STORE_URL=https://checkpoints.testnet.sui.io
LISTEN_ADDR=0.0.0.0:4000
```

---

## 9. Deployment

| Component | Hosting |
|---|---|
| Frontend | Walrus Sites via `site-builder` |
| PostgreSQL | Managed (Supabase / RDS) or self-hosted |
| Indexer | Docker container — long-running, needs stable DB connection |
| GraphQL server | Docker container — stateless, horizontally scalable |

```bash
# Frontend
cd frontend && pnpm build
site-builder deploy ./dist --epochs 52

# Backend
docker compose up -d
```

CI/CD on push to `main`: build frontend → deploy to Walrus Sites; build Rust containers → deploy to hosting.
