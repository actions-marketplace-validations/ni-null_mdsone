// ============================================================
// src/cli/errors.ts
// Structured CLI errors and message formatting.
// ============================================================

export class CliError extends Error {
  readonly exitCode: number;
  readonly details: string[];

  constructor(message: string, options?: { details?: string[]; exitCode?: number }) {
    super(message);
    this.name = "CliError";
    this.exitCode = options?.exitCode ?? 1;
    this.details = options?.details ?? [];
  }
}

export function cliErrorMessages(error: unknown): { exitCode: number; lines: string[] } {
  if (error instanceof CliError) {
    const lines = [error.message, ...error.details].filter(Boolean);
    return { exitCode: error.exitCode, lines };
  }
  return {
    exitCode: 1,
    lines: [`[ERROR] Unexpected error: ${error instanceof Error ? error.message : String(error)}`],
  };
}

