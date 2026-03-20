# Walrus AI Policy Archive

A preservation layer for AI governance research. Metadata lives on Sui; file content lives on Walrus. Both are independently verifiable without this application.

## Structure

```
contract/    Sui Move package (walrus_ai_policy)
frontend/    React + Vite — deployed as a Walrus Site
backend/     Rust workspace: indexer + GraphQL API + shared DB crate
```

## Prerequisites

- [Rust](https://rustup.rs) stable
- [Bun](https://bun.sh) (frontend)
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- PostgreSQL running locally

## Local Dev

**Backend**
```bash
cd backend
cp .env.example .env   # fill in DATABASE_URL, REMOTE_STORE_URL
cargo build
cargo run --bin archive-indexer
cargo run --bin archive-graphql
```

**Frontend**
```bash
cd frontend
bun install
bun dev
```

**Contract**
```bash
cd contract
sui move build
sui move test
```

## Docs

- [PRD](docs/PRD.md) — product requirements and scope
- [System Design](docs/SYSTEM_DESIGN.md) — architecture and data flows
- [Data Model](docs/DATA_MODEL.md) — on-chain structs, Postgres schema, events