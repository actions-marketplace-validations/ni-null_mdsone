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
    .option("-f, --force <boolean>", "Overwrite existing output file (default: true)", "true")
    // Templates & Styling
    .option("--template <NAME|PATH>", "Template name or template folder path (default: normal)")
    .option("--template-type <NAME>", "Template type variant (default: default)")
    .option("--site-title <TEXT>", "Documentation site title (default: Documentation)")
    .option("--theme-mode <light|dark>", "Theme mode: light or dark (default: light)")
    .option("--minify-html <true|false>", "Minify HTML output (default: true)")
    // Internationalization
    .option("--locale <CODE>", "UI locale code (e.g., en, zh-TW; default: en)")
    .option("--i18n-mode", "Enable multi-language mode")
    .option("--i18n-default <CODE>", "Default locale in i18n mode")
    // Config
    .option("--config <PATH>", "Specify config.toml path")
    .option("--no-config", "Ignore config.toml")
    .allowUnknownOption(false);

  // Plugin-owned CLI options
  for (const plugin of builtInPlugins) {
    plugin.registerCli?.(program as unknown as CliProgram);
  }

  program.parse(argv ?? process.argv);
  const opts = program.opts<Record<string, unknown>>();
  const typed = opts as {
    merge?: boolean;
    output?: string;
    force?: string;
    template?: string;
    locale?: string;
    siteTitle?: string;
    themeMode?: string;
    i18nMode?: boolean;
    defaultLocale?: string;
    minifyHtml?: string;
    templateType?: string;
    config?: string;
    configPath?: string;
    noConfig?: boolean;
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
    locale: typed.locale,
    siteTitle: typed.siteTitle,
    themeMode: typed.themeMode,
    i18nMode: typed.i18nMode,
    defaultLocale: typed.defaultLocale,
    minifyHtml: typed.minifyHtml,
    templateType: typed.templateType,
    configPath: typed.config,
    noConfig: typed.noConfig,
    pluginOverrides,
    version: typed.version,
  };
}

