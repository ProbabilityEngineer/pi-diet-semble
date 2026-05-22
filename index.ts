import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

type ExecResult = {
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  code?: number;
};

function outputText(result: ExecResult): string {
  const stdout = result.stdout?.trim();
  const stderr = result.stderr?.trim();
  if (stdout && stderr) return `${stdout}\n\nstderr:\n${stderr}`;
  return stdout || stderr || "No Semble results.";
}

function normalizePath(path: string | undefined, cwd: string): string {
  return path?.trim() || cwd;
}

export default function sembleExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "semble_search",
    label: "Semble Search",
    description:
      "Search a codebase semantically with Semble for behavior/concept discovery.",
    promptSnippet:
      "Tool routing: use semble_search before rg/find/file listing for behavior discovery; use AST/LSP for structure.",
    promptGuidelines: [
      "For behavior/intent discovery, start with semble_search, not rg/find/file listing; use AST/LSP for structural calls/imports/exports.",
      "Use rg for exact literal verification after discovery, or when the user asks for exact text.",
    ],
    parameters: Type.Object({
      query: Type.String({
        description: "Natural-language description, symbol, identifier, or code search query.",
      }),
      path: Type.Optional(
        Type.String({
          description: "Repository path or git URL. Defaults to pi's current working directory.",
        }),
      ),
      topK: Type.Optional(
        Type.Number({
          description: "Maximum number of results to return.",
        }),
      ),
      includeTextFiles: Type.Optional(
        Type.Boolean({
          description: "Also index non-code text files such as Markdown, YAML, and JSON.",
        }),
      ),
    }),
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const args = ["search", params.query, normalizePath(params.path, ctx.cwd)];
      if (params.topK !== undefined) args.push("--top-k", String(params.topK));
      if (params.includeTextFiles) args.push("--include-text-files");

      const result = (await pi.exec("semble", args, {
        cwd: ctx.cwd,
        signal,
      })) as ExecResult;

      return {
        content: [{ type: "text", text: outputText(result) }],
        details: { command: "semble", args, result },
      };
    },
  });

  pi.registerTool({
    name: "semble_related",
    label: "Semble Related",
    description:
      "Find code semantically related to a known file and line using Semble find-related.",
    promptSnippet:
      "Use semble_related as a follow-up from a promising Semble result.",
    promptGuidelines: [
      "Use semble_related after semble_search to find code related to a known file/line.",
    ],
    parameters: Type.Object({
      filePath: Type.String({ description: "File path from a prior Semble result." }),
      line: Type.Number({ description: "Line number from the known relevant location." }),
      path: Type.Optional(
        Type.String({
          description: "Repository path or git URL. Defaults to pi's current working directory.",
        }),
      ),
      topK: Type.Optional(
        Type.Number({ description: "Maximum number of related results to return." }),
      ),
      includeTextFiles: Type.Optional(
        Type.Boolean({
          description: "Also index non-code text files such as Markdown, YAML, and JSON.",
        }),
      ),
    }),
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const args = [
        "find-related",
        params.filePath,
        String(params.line),
        normalizePath(params.path, ctx.cwd),
      ];
      if (params.topK !== undefined) args.push("--top-k", String(params.topK));
      if (params.includeTextFiles) args.push("--include-text-files");

      const result = (await pi.exec("semble", args, {
        cwd: ctx.cwd,
        signal,
      })) as ExecResult;

      return {
        content: [{ type: "text", text: outputText(result) }],
        details: { command: "semble", args, result },
      };
    },
  });
}
