// ============================================================
// src/cli/args.ts — CLI 引數解析（commander）
// ============================================================

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import type { CliArgs, Config, CliProgram } from "../core/types.js";
import { builtInPlugins } from "../plugins/index.js";

function readPkgVersion(): string {
  try {
    const dir = import.meta.url
      ? path.dirname(fileURLToPath(import.meta.url))
      : process.cwd();
    const candidates = [
      path.resolve(dir, "../../package.json"),  // dev: src/cli/ → root
      path.resolve(dir, "../package.json"),      // dist: dist/ → root
      path.resolve(process.cwd(), "package.json"),
    ];
    for (const p of candidates) {
      try {
        const data = JSON.parse(readFileSync(p, "utf-8")) as { version?: string; name?: string };
        if (data.name === "mdsone") return data.version ?? "0.0.0";
      } catch { /* try next */ }
    }
  } catch { /* fall through */ }
  return "0.0.0";
}

const VERSION = readPkgVersion();

function findI18nModeSpaceArg(args: string[]): string | null {
  const localeLike = /^[A-Za-z]{2,3}(?:[-_][A-Za-z0-9]+)*$/;
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--i18n-mode") continue;
    const next = args[i + 1];
    if (!next) continue;
    if (next.startsWith("-")) continue;
    if (localeLike.test(next)) {
      return next;
    }
  }
  return null;
}

function findCodeCopySpaceArg(args: string[]): string | null {
  const modeLike = /^(off|line|cmd)$/i;
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--code-copy") continue;
    const next = args[i + 1];
    if (!next) continue;
    if (next.startsWith("-")) continue;
    if (modeLike.test(next)) {
      return next;
    }
  }
  return null;
}

function findCodeHighlightSpaceArg(args: string[]): string | null {
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--code-highlight") continue;
    const next = args[i + 1];
    if (!next) continue;
    if (next.startsWith("-")) continue;
    if (/^off$/i.test(next)) return next;
  }
  return null;
}

function findCodeLineNumberSpaceArg(args: string[]): string | null {
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--code-line-number") continue;
    const next = args[i + 1];
    if (!next) continue;
    if (next.startsWith("-")) continue;
    if (/^off$/i.test(next)) return next;
  }
  return null;
}

function findImgEmbedSpaceArg(args: string[]): string | null {
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== "--img-embed") continue;
    const next = args[i + 1];
    if (!next) continue;
    if (next.startsWith("-")) continue;
    if (/^(off|base64)$/i.test(next)) return next;
  }
  return null;
}

/**
 * 解析 CLI 引數並回傳 CliArgs（純物件，不修改 process.env）。
 */
export function parseArgs(argv?: string[]): CliArgs {
  const program = new Command();

  program
    .name("mdsone")
    .description("mdsone — Convert Markdown to self-contained HTML")
    .version(VERSION, "-v, --version", "Display version")
    .argument("[inputs...]", "Input: single file, multiple files, or single folder path")
    // Output
    .option("-m, --merge", "Merge all inputs into a single HTML output")
    .option("-o, --output <PATH>", "Output HTML file path")
    .option("-f, --force <boolean>", "Overwrite existing output file (default: true)")
    // Templates & Styling
    .option("-t, --template <NAME|PATH[@VARIANT]>", "Template name/path with optional variant (e.g. normal@warm-cream)")
    .option("--site-title <TEXT>", "Documentation site title (default: Documentation)")
    // Internationalization
    .option("--i18n-mode [CODE]", "Enable multi-language mode; optional CODE via --i18n-mode=CODE (e.g. --i18n-mode=zh-TW)")
    // Config
    .option("--config <PATH>", "Specify config.toml path")
    .allowUnknownOption(false);

  // Plugin-owned CLI options
  for (const plugin of builtInPlugins) {
    plugin.registerCli?.(program as unknown as CliProgram);
  }

  const parseInput = argv ?? process.argv;
  const badLocale = findI18nModeSpaceArg(parseInput);
  if (badLocale) {
    program.error(
      `Invalid i18n mode syntax: '--i18n-mode ${badLocale}'. Use '--i18n-mode=${badLocale}' instead.`,
      { exitCode: 1 },
    );
  }
  const badCopyMode = findCodeCopySpaceArg(parseInput);
  if (badCopyMode) {
    program.error(
      `Invalid code copy syntax: '--code-copy ${badCopyMode}'. Use '--code-copy=${badCopyMode}' instead.`,
      { exitCode: 1 },
    );
  }
  const badHighlightMode = findCodeHighlightSpaceArg(parseInput);
  if (badHighlightMode) {
    program.error(
      `Invalid code highlight syntax: '--code-highlight ${badHighlightMode}'. Use '--code-highlight=${badHighlightMode}' instead.`,
      { exitCode: 1 },
    );
  }
  const badLineNumberMode = findCodeLineNumberSpaceArg(parseInput);
  if (badLineNumberMode) {
    program.error(
      `Invalid line number syntax: '--code-line-number ${badLineNumberMode}'. Use '--code-line-number=${badLineNumberMode}' instead.`,
      { exitCode: 1 },
    );
  }
  const badImgEmbedMode = findImgEmbedSpaceArg(parseInput);
  if (badImgEmbedMode) {
    program.error(
      `Invalid image embed syntax: '--img-embed ${badImgEmbedMode}'. Use '--img-embed=${badImgEmbedMode}' instead.`,
      { exitCode: 1 },
    );
  }

  program.parse(parseInput);
  const opts = program.opts<Record<string, unknown>>();
  const typed = opts as {
    merge?: boolean;
    output?: string;
    force?: string;
    template?: string;
    siteTitle?: string;
    i18nMode?: boolean | string;
    config?: string;
    configPath?: string;
    version?: boolean;
  };

  const inputs: string[] = (program.processedArgs[0] as string[] | undefined) ?? [];
  const pluginOverrides: Partial<Config> = {};
  for (const plugin of builtInPlugins) {
    plugin.cliToConfig?.(opts, pluginOverrides);
  }

  return {
    inputs,
    merge: typed.merge,
    output: typed.output,
    force: typed.force,
    template: typed.template,
    siteTitle: typed.siteTitle,
    i18nMode: typed.i18nMode,
    configPath: typed.config,
    pluginOverrides,
    version: typed.version,
  };
}

