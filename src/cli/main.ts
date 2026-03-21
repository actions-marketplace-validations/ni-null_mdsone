// ============================================================
// src/cli/main.ts
// Thin CLI entrypoint: wire renderer + pipeline + exit handling.
// ============================================================

import { createCliRenderer } from "./renderer.js";
import { cliErrorMessages } from "./errors.js";
import { runCli } from "./pipeline.js";

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

runCli({
  info: logInfo,
  warn: logWarn,
  error: logError,
  outputLine(outputPath, sizeBytes) {
    console.info(cliRenderer.formatOutputLine(outputPath, sizeBytes));
  },
}).catch((error) => {
  const { exitCode, lines } = cliErrorMessages(error);
  for (const line of lines) {
    logError(line);
  }
  process.exit(exitCode);
});

