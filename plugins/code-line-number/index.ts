// ============================================================
// plugins/code-line-number/index.ts - Line number plugin
// ============================================================

import { load, type CheerioAPI } from "cheerio";
import type { Config, Plugin, PluginAssets } from "../../src/core/types.js";
import { DEFAULT_CONFIG } from "../../src/core/config.js";
import { getLineNumberStyle } from "./line-number.js";

const LINE_NUMBER_CSS = `<style id="mdsone-line-number">\n${getLineNumberStyle()}\n</style>`;

type LineNumberPluginConfig = { enable?: boolean };

function readLineNumberPluginConfig(config: Config): LineNumberPluginConfig {
  const raw = config.plugins?.config?.["code-line-number"];
  return (raw && typeof raw === "object" ? raw : {}) as LineNumberPluginConfig;
}

function trimTrailingEmpty(lines: string[]): string[] {
  return lines.length > 0 && lines[lines.length - 1] === "" ? lines.slice(0, -1) : lines;
}

function injectIntoWrapped(innerHtml: string): string {
  let idx = 0;
  return innerHtml.replace(
    /(<span[^>]*\bcode-line\b[^>]*>)([\s\S]*?)(<\/span>)/g,
    (_match, open, content, close) => {
      if (content.includes("code-line-number")) return _match;
      const num = ++idx;
      return (
        `${open}` +
        `<span class="code-line-number">${num}</span>` +
        `<span class="code-line-content">${content || "\u200b"}</span>` +
        `${close}`
      );
    },
  );
}

function injectIntoPlain(innerHtml: string): string {
  return trimTrailingEmpty(innerHtml.split("\n"))
    .map(
      (lineHtml, idx) =>
        `<span class="code-line">` +
        `<span class="code-line-number">${idx + 1}</span>` +
        `<span class="code-line-content">${lineHtml || "\u200b"}</span>` +
        `</span>`,
    )
    .join("");
}

export const codeLineNumberPlugin: Plugin = {
  name: "code-line-number",

  isEnabled: (config) => readLineNumberPluginConfig(config).enable === true,

  processDom(dom) {
    const $ = dom as CheerioAPI;
    $("pre > code").each((_idx, codeNode) => {
      const codeEl = $(codeNode);
      const preEl = codeEl.parent("pre");
      if (!preEl.length) return;
      if (preEl.attr("data-line-number-ready") === "1") return;

      const innerHtml = codeEl.html() || "";
      const isWrapped =
        codeEl.find(".code-line").length > 0 ||
        innerHtml.includes('class="code-line"') ||
        innerHtml.includes("class='code-line'");

      const newInner = isWrapped ? injectIntoWrapped(innerHtml) : injectIntoPlain(innerHtml);
      codeEl.html(newInner);
      preEl.addClass("mdsone-line-number");
      preEl.attr("data-line-number-ready", "1");
    });
  },

  getAssets(): PluginAssets {
    return { css: LINE_NUMBER_CSS };
  },
};

export interface CodeLineNumberOptions {
  enable?: boolean;
  config?: Partial<Config>;
}

function resolveLineNumberConfig(options: CodeLineNumberOptions = {}): Config {
  const enable = options.enable ?? true;
  const plugins = options.config?.plugins ?? {};
  const pluginConfig = plugins.config ?? {};
  const lineNumber = (pluginConfig["code-line-number"] ?? {}) as Record<string, unknown>;
  return {
    ...DEFAULT_CONFIG,
    ...options.config,
    plugins: {
      ...plugins,
      config: {
        ...pluginConfig,
        "code-line-number": { ...lineNumber, enable },
      },
    },
  };
}

export async function codeLineNumber(html: string, options: CodeLineNumberOptions = {}): Promise<string> {
  const config = resolveLineNumberConfig(options);
  if (!codeLineNumberPlugin.isEnabled(config) || !codeLineNumberPlugin.processDom) return html;
  const $ = load(html, {}, false);
  await codeLineNumberPlugin.processDom($ as unknown, config, { sourceDir: "" });
  return $.html() || html;
}

export async function codeLineNumberAssets(options: CodeLineNumberOptions = {}): Promise<PluginAssets> {
  const config = resolveLineNumberConfig(options);
  if (!codeLineNumberPlugin.isEnabled(config) || !codeLineNumberPlugin.getAssets) return {};
  return await codeLineNumberPlugin.getAssets(config);
}
