# pi-diet-semble

A [pi](https://pi.dev) extension that adds [Semble](https://github.com/MinishLab/semble) semantic code search as first-class tools, without MCP and without large prompt snippets.

## Tools

- `semble_search` — natural-language, symbol, or identifier code search.
- `semble_related` — find code related to a known file and line.

Both tools support `includeTextFiles: true` to pass Semble's `--include-text-files` flag for Markdown, YAML, JSON, and other non-code text files.

## Requirements

Install the Semble CLI so `semble` is on your `PATH`:

```bash
pip install semble
# or
uv tool install semble
```

## Install for pi

Install from GitHub:

```bash
pi install git:github.com/ProbabilityEngineer/pi-diet-semble
```

Or clone this repo, then add it to `~/.pi/agent/settings.json`:

```json
{
  "extensions": ["/absolute/path/to/pi-diet-semble"]
}
```

Or copy/symlink `index.ts` into `~/.pi/agent/extensions/pi-diet-semble.ts`.

Run `/reload` in pi after installing.

## Usage

Ask pi questions like:

- "Find where authentication is handled."
- "Search for the save model implementation."
- "Find code related to `src/auth.ts` line 42."

The extension nudges the model to use Semble for exploratory behavior discovery, AST/LSP for structural code or known symbols, and grep for exact literal text.

## Development

```bash
npm install
npm run typecheck
```

## License

MIT
