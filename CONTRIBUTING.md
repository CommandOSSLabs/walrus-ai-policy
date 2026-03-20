# Contributing

## Branches

- `main` — stable, deployable
- `feat/<ticket>` — feature branches, PR into main

## Workflow

1. Branch from `main`
2. Keep PRs focused — one concern per PR
3. Run checks before pushing:
   - Rust: `cargo clippy && cargo test`
   - Frontend: `bun run clean` (lint + type-check)
   - Contract: `sui move test`
4. PR description: what changed and why

## Code Style

- Rust: `rustfmt` defaults, Clippy warnings are errors in CI
- TypeScript: ESLint + Prettier (enforced by `bun run clean`)
- Move: follow existing patterns in `sources/artifact.move`

## Commit Messages

Plain English, imperative mood. `Add X`, `Fix Y`, `Remove Z`. No ticket numbers required in the message.
