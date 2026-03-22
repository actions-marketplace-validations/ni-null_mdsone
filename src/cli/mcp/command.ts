// ============================================================
// src/cli/mcp/command.ts
// MCP subcommand routing for `mdsone mcp`.
// ============================================================

import { CliError } from "../errors.js";
import { runMcpServer } from "./server.js";

const MCP_HELP_TEXT = [
  "Usage: mdsone mcp [serve]",
  "",
  "Commands:",
  "  serve   Start MCP server with stdio transport (default)",
  "",
  "Examples:",
  "  mdsone mcp",
  "  mdsone mcp serve",
].join("\n");

function isHelpArg(value: string | undefined): boolean {
  return value === "help" || value === "-h" || value === "--help";
}

export async function runMcpCommand(rawArgs: string[]): Promise<void> {
  const [command, ...rest] = rawArgs;

  if (isHelpArg(command)) {
    console.info(MCP_HELP_TEXT);
    return;
  }

  if (!command || command === "serve") {
    if (rest.length > 0) {
      throw new CliError(`Unknown arguments for 'mdsone mcp ${command ?? "serve"}': ${rest.join(" ")}`);
    }
    await runMcpServer();
    return;
  }

  throw new CliError(`Unknown mcp subcommand: ${command}`, {
    details: ["Use 'mdsone mcp --help' for available commands."],
  });
}

