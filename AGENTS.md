# Agent Instructions

## Repository

- `pi-diet-semble` is a TypeScript Pi extension exposing on-demand Semble semantic code-search tools.
- Keep semantic search focused on behavior and intent discovery, not exhaustive syntax matching or resolved symbol navigation; preserve compact results and explicit invocation.
- The extension entry point is `index.ts`.

## Validation

- Run `npm run typecheck` after implementation changes.
- Live semantic-search checks require the Semble CLI. Run them only when it is installed and configured; otherwise report that live checks were not run. Typechecking does not require that CLI or other Pi extensions.

## Version control

- Use normal Git workflows. Inspect `git status` and the diff before committing or pushing.
