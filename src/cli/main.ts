// ============================================================
// src/cli/main.ts
// Thin CLI entrypoint: wire renderer + pipeline + exit handling.
// ============================================================

import { createCliRenderer } from "./renderer.js";
import { cliErrorMessages } from "./errors.js";
import { runCli } from "./pipeline.js";
import { runMcpCommand } from "./mcp/command.js";

const cliRenderer = createCliRenderer();

function stripLevelPrefix(message: string): string {
  return message.replace(/^\[(?:ERROR|Error|WARN|INFO)\]\s*/u, "");
}

function logInfo(message: string): void {
  console.info(cliRenderer.formatInfo(stripLevelPrefix(message)));
}

function logWarn(message: string): void {
  console.warn(cliRenderer.formatWarn(stripLevelPrefix(message)));
}

function logError(message: string): void {
  console.error(cliRenderer.formatError(stripLevelPrefix(message)));
}

async function main(): Promise<void> {
  const userArgs = process.argv.slice(2);
  if (userArgs[0] === "mcp") {
    await runMcpCommand(userArgs.slice(1));
    return;
  }

  await runCli({
    info: logInfo,
    warn: logWarn,
    error: logError,
    outputLine(outputPath, sizeBytes) {
      console.info(cliRenderer.formatOutputLine(outputPath, sizeBytes));
    },
  });
}

main().catch((error) => {
  const { exitCode, lines } = cliErrorMessages(error);
  for (const line of lines) {
    logError(line);
  }
  process.exit(exitCode);
});
