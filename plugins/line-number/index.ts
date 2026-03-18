// ============================================================
// plugins/line-number/index.ts — Line number plugin
// ============================================================

import type { Config, Plugin, PluginAssets } from "../../src/core/types.js";
import { DEFAULT_CONFIG } from "../../src/core/config.js";
import { getLineNumberStyle } from "./line-number.js";
import { load } from "cheerio";

function trimTrailingEmpty(lines: string[]): string[] {
  return lines.length > 0 && lines[lines.length - 1] === "" ? lines.slice(0, -1) : lines;
}

export const lineNumberPlugin: Plugin = {
  name: "line_number",

  registerCli(program) {
    const parseMode = (raw: string): "off" => {
      const v = String(raw ?? "").trim().toLowerCase();
      if (v === "off") return "off";
      throw new Error("Invalid value for --code-line-number. Use off.");
    };
    program.option(
      "--code-line-number [off]",
      "Show line numbers in code blocks (use --code-line-number or --code-line-number=off)",
      parseMode,
    );
  },

  cliToConfig(opts, out) {
    const raw = opts["codeLineNumber"];
    if (raw === true) {
      out.code_line_number = true;
    } else if (typeof raw === "string") {
      const v = raw.toLowerCase();
      if (v === "off") out.code_line_number = false;
    }
  },

  isEnabled: (config) => config.code_line_number === true,

  processHtml(html) {
    const $ = load(html, {}, false);
    $("pre > code").each((_i, el) => {
      const codeEl = $(el);
      const preEl = codeEl.parent("pre");
      if (!preEl.length) return;

      if (codeEl.find(".code-line").length > 0) {
        codeEl.find(".code-line").each((idx, line) => {
          const lineEl = $(line);
          if (lineEl.find(".code-line-number").length > 0) return;
          const content = lineEl.html() || "\u200b";
          lineEl.html(
            `<span class="code-line-number">${idx + 1}</span><span class="code-line-content">${content}</span>`,
          );
        });
      } else {
        const htmlLines = trimTrailingEmpty((codeEl.html() || "").split("\n"));
        const wrapped = htmlLines.map((lineHtml, idx) =>
          `<span class="code-line"><span class="code-line-number">${idx + 1}</span><span class="code-line-content">${lineHtml || "\u200b"}</span></span>`,
        );
        codeEl.html(wrapped.join(""));
      }

      preEl.addClass("mdsone-line-number");
      preEl.attr("data-line-number-ready", "1");
    });
    return $.html() || html;
  },

  getAssets(): PluginAssets {
    const css = `<style id="mdsone-line-number">\n${getLineNumberStyle()}\n</style>`;
    return { css };
  },
};

export interface LineNumberOptions {
  /** true to enable line numbers, false to disable. */
  enable?: boolean;
  /** Advanced override for full config control. */
  config?: Partial<Config>;
}

function resolveLineNumberConfig(options: LineNumberOptions = {}): Config {
  const enable = options.enable ?? true;
  return {
    ...DEFAULT_CONFIG,
    ...options.config,
    code_line_number: enable,
  };
}

/** Convenience transformer: `result = await lineNumber(result)` */
export async function lineNumber(html: string, options: LineNumberOptions = {}): Promise<string> {
  const config = resolveLineNumberConfig(options);
  if (!lineNumberPlugin.isEnabled(config) || !lineNumberPlugin.processHtml) return html;
  return await lineNumberPlugin.processHtml(html, config, { sourceDir: "" });
}

/** Plugin CSS assets for host template injection. */
export async function lineNumberAssets(options: LineNumberOptions = {}): Promise<PluginAssets> {
  const config = resolveLineNumberConfig(options);
  if (!lineNumberPlugin.isEnabled(config) || !lineNumberPlugin.getAssets) return {};
  return await lineNumberPlugin.getAssets(config);
}
