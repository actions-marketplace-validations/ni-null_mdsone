// ============================================================
// src/core/template.ts — 模板組裝純函數層
// 對應 Python src/template_loader.py（組裝部分，不含 I/O）
// 核心層：零 I/O 依賴
// ============================================================

import type { TemplateData } from "./types.js";

/**
 * 產生額外 CSS 標籤（對應 Python generate_extra_css_tags()）。
 * - extra_css_urls      → <link rel="stylesheet" href="...">
 * - inline_css_contents → <style>/* filename *\/\n...\n</style>
 */
export function generateExtraCssTags(
  urls: string[],
  inlineContents: Record<string, string>,
): string {
  const tags: string[] = [];
  for (const url of urls) {
    tags.push(`    <link rel="stylesheet" href="${url}">`);
  }
  for (const [filename, content] of Object.entries(inlineContents)) {
    tags.push(`    <style>/* ${filename} */\n${content}\n    </style>`);
  }
  return tags.join("\n");
}

/**
 * 產生額外 JS 標籤（對應 Python generate_extra_js_tags()）。
 * - extra_js_urls       → <script src="..."></script>
 * - inline_js_contents  → <script>/* filename *\/\n...\n</script>
 */
export function generateExtraJsTags(
  urls: string[],
  inlineContents: Record<string, string>,
): string {
  const tags: string[] = [];
  for (const url of urls) {
    tags.push(`    <script src="${url}"></script>`);
  }
  for (const [filename, content] of Object.entries(inlineContents)) {
    tags.push(`    <script>/* ${filename} */\n${content}\n    </script>`);
  }
  return tags.join("\n");
}

/**
 * 將 template HTML 中的 `{PLACEHOLDER}` 替換為指定值（對應 Python html_output.replace(...)）。
 * 替換完成後清除殘留的 `{UPPERCASE_WORD}` 佔位符。
 */
export function assembleTemplate(
  template: string,
  replacements: Record<string, string>,
): string {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    // 使用 replaceAll 確保全文替換（Python str.replace 也是全文替換）
    html = html.split(`{${key}}`).join(value);
  }
  // 清除殘餘的 {UPPERCASE_WORD} 佔位符
  html = html.replace(/\{[A-Z_]+\}/g, "");
  return html;
}

/**
 * 從已載入的 TemplateData 提取 template dir 的 inline 資源內容，
 * 回傳組裝好的 <link>/<style>/<script> 標籤字串。
 */
export function buildExtraTags(templateData: TemplateData): {
  cssTagsHtml: string;
  jsTagsHtml: string;
} {
  return {
    cssTagsHtml: generateExtraCssTags(templateData.extra_css_urls, templateData.inline_css_contents),
    jsTagsHtml:  generateExtraJsTags(templateData.extra_js_urls,  templateData.inline_js_contents),
  };
}
