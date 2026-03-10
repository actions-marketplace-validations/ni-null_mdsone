// ============================================================
// src/cli/args.ts — CLI 引數解析（commander）
// 對應 Python main.py 的 argparse 段落
// ============================================================

import { Command } from "commander";
import type { CliArgs } from "../core/types.js";

const EXAMPLES = `
EXAMPLES:
  npx mdsone --template normal --locale zh-TW
  npx mdsone --source ./README.md --output index.html
  npx mdsone --source ./docs --output build/docs.html
  npx mdsone --template minimal --locale en --output output.html --source ./markdown
  npx mdsone --source ./docs --output-dir ./dist --output-filename guide.html
  npx mdsone --source ./docs --i18n-mode true
  npx mdsone --source ./README.md --output index.html --img-to-base64 true
  npx mdsone --source ./README.md --output index.html --img-to-base64 true --img-max-width 800 --img-compress 85

ENVIRONMENT VARIABLES:
  MARKDOWN_SOURCE_DIR    Markdown source directory     (default: ./markdown)
  OUTPUT_FILE            Output file path              (default: system_guide.html)
  OUTPUT_DIR             Output directory              (default: empty)
  OUTPUT_FILENAME        Output filename               (default: empty)
  TEMPLATES_DIR          Templates directory           (default: templates)
  DEFAULT_TEMPLATE       Default template name         (default: normal)
  MINIFY_HTML            Minify HTML output            (default: true)
  SITE_TITLE             Documentation site title      (default: Documentation)
  THEME_MODE             Theme mode: light | dark      (default: light)
  LOCALE                 UI locale code                (default: en)
  I18N_MODE              Multi-language mode           (default: false)
  DEFAULT_LOCALE         Default locale in i18n mode   (default: empty)
  LOCALES_DIR            Locales directory             (default: locales)
  TEMPLATE_CONFIG_FILE   Template config filename      (default: template.config.json)
  BUILD_DATE             Build date for footer         (auto-generated if not set)
`;

/**
 * 解析 CLI 引數並回傳 CliArgs（純物件，不修改 process.env）。
 * 對應 Python argparse + CONFIG 覆寫段落。
 */
export function parseArgs(argv?: string[]): CliArgs {
  const program = new Command();

  program
    .name("mdsone")
    .description("mdsone — Convert Markdown to self-contained HTML")
    .addHelpText("after", EXAMPLES)
    .option("--template <NAME>",          "Template name to use (e.g., normal, minimal)")
    .option("--locale <CODE>",            "Locale/language code (e.g., en, zh-TW)")
    .option("--output <PATH>",            "Output HTML file path")
  .option("--source <PATH>",            "Markdown source (file or directory)")
    .option("--output-dir <DIR>",         "Output directory")
    .option("--output-filename <NAME>",   "Output filename (e.g., docs.html)")
    .option("--i18n-mode <true|false>",        "Enable/disable multi-language mode")
    .option("--img-to-base64 <true|false>",     "Embed images as base64 (local + remote) (default: false)")
    .option("--img-max-width <pixels>",         "Resize images to max width in pixels (requires sharp)")
    .option("--img-compress <1-100>",           "Compression quality 1-100 (requires sharp)")
    .allowUnknownOption(false);

  program.parse(argv ?? process.argv);
  const opts = program.opts<{
    template?:        string;
    locale?:          string;
    output?:          string;
    source?:          string;
    outputDir?:       string;
    outputFilename?:  string;
    i18nMode?:        string;
    imgToBase64?:     string;
    imgMaxWidth?:     string;
    imgCompress?:     string;
  }>();

  return {
    template:        opts.template,
    locale:          opts.locale,
    output:          opts.output,
    source:          opts.source,
    outputDir:       opts.outputDir,
    outputFilename:  opts.outputFilename,
    i18nMode:        opts.i18nMode,
    imgToBase64:     opts.imgToBase64,
    imgMaxWidth:     opts.imgMaxWidth,
    imgCompress:     opts.imgCompress,
  };
}
