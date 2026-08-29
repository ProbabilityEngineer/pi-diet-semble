# pi-diet-semble

> One of my diet context engineering and workflow extensions. Explore the complete collection: <https://www.npmjs.com/~probabilityengineer>

On-demand Semble semantic code search tools for Pi.

`pi-diet-semble` gives Pi agents compact, model-visible tools for exploratory code discovery with [Semble](https://github.com/MinishLab/semble). It is designed for behavior and intent searches — finding where authentication, persistence, rendering, or other concepts are implemented — without MCP, automatic scans, or large prompt snippets.

Use it alongside structural tools: Semble for behavior discovery, AST tools for syntax-shaped searches, LSP tools for known symbols and types, and grep for exact literals.

## Tools

- `semble_search` — natural-language, symbol, or identifier code search
- `semble_related` — find code related to a known file and line

Both tools support `includeTextFiles: true` to pass Semble's `--include-text-files` flag for Markdown, YAML, JSON, and other non-code text files.

## Requirements

Install the Semble CLI so `semble` is on your `PATH`:

```bash
pip install semble
# or
uv tool install semble
```

## Install

From npm:

```bash
pi install npm:pi-diet-semble
```

From GitHub:

```bash
pi install git:github.com/ProbabilityEngineer/pi-diet-semble
```

For project-local install, add `-l`:

```bash
pi install -l npm:pi-diet-semble
```

For local testing:

```bash
pi -e ./index.ts
```

## Usage

Ask Pi questions like:

- "Find where authentication is handled."
- "Search for the save model implementation."
- "Find code related to `src/auth.ts` line 42."

The extension nudges agents to use Semble for exploratory behavior discovery, AST/LSP for structural code or known symbols, and grep for exact literal text.

## Prompt overhead

`pi-diet-semble` registers two compact tools and routing guidance only. It does not inject search results or repository state into prompts.

## Development

```bash
npm install
npm run typecheck
```

## License

MIT
