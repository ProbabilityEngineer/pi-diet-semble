import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { StringEnum } from "@earendil-works/pi-ai";
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
      "Search a codebase semantically with Semble. Good for behavior, concepts, and symbols before broad grep/read exploration.",
    promptSnippet:
      "Search code semantically with semble_search before broad grep/read exploration.",
    promptGuidelines: [
      "Use semble_search to find relevant code by behavior, concept, or symbol before reading whole files.",
      "Use semble_search before grep for exploratory code discovery; use grep when exhaustive literal matching is needed.",
      "Use semble_related with a promising semble_search result's file path and line to discover related implementations.",
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
      content: Type.Optional(
        StringEnum(["code", "docs", "config", "all"] as const, {
          description: "Content type to search. Defaults to Semble's code search.",
        }),
      ),
    }),
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const args = ["search", params.query, normalizePath(params.path, ctx.cwd)];
      if (params.topK !== undefined) args.push("--top-k", String(params.topK));
      if (params.content !== undefined) args.push("--content", params.content);

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
      "Find semantically related code from a known location with semble_related.",
    promptGuidelines: [
      "Use semble_related after semble_search when one result looks relevant and nearby related code may exist elsewhere.",
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
    }),
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      const args = [
        "find-related",
        params.filePath,
        String(params.line),
        normalizePath(params.path, ctx.cwd),
      ];
      if (params.topK !== undefined) args.push("--top-k", String(params.topK));

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
