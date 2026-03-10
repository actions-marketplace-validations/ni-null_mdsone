// ============================================================
// src/core/i18n.ts — 國際化純函數層
// 對應 Python src/i18n.py（去除 I/O，接收已讀取的 I18nFile 物件）
// 核心層：零 I/O 依賴
// ============================================================

import type { I18nFile } from "./types.js";

/**
 * 簡單字串格式化：將 `{key}` 替換為 vars[key]（對應 Python str.format(**kwargs)）。
 * 安全：未找到的 key 保留原佔位符，不拋例外。
 */
function formatString(text: string, vars?: Record<string, string>): string {
  if (!vars || Object.keys(vars).length === 0) return text;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

/** 取得 CLI 訊息字串（對應 Python i18n.get_cli()） */
export function getCliString(
  file: I18nFile,
  key: string,
  vars?: Record<string, string>,
): string {
  const text = file.cli?.[key] ?? key;
  return formatString(text, vars);
}

/** 取得 template UI 字串（對應 Python i18n.get_template()） */
export function getTemplateString(
  file: I18nFile,
  key: string,
  vars?: Record<string, string>,
): string {
  const text = file.template?.[key] ?? key;
  return formatString(text, vars);
}

/**
 * 取得所有 template 字串並替換 BUILD_DATE（對應 Python i18n.get_all_template()）。
 * `_` 開頭的 key（_comment、_locale 等）會被過濾。
 */
export function getAllTemplateStrings(
  file: I18nFile,
  buildDate: string,
): Record<string, string> {
  const raw = file.template ?? {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith("_")) continue;
    result[k] = typeof v === "string"
      ? v.replace(/\{BUILD_DATE\}/g, buildDate)
      : v;
  }
  return result;
}

/**
 * 取得多個 locale 的 template 字串映射（對應 Python i18n.get_all_locales_template()）。
 * localeFiles：Node adapter 已讀取的各 locale 檔案 map。
 */
export function getAllLocalesTemplateStrings(
  localeFiles: Record<string, I18nFile>,
  buildDate: string,
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  for (const [locale, file] of Object.entries(localeFiles)) {
    result[locale] = getAllTemplateStrings(file, buildDate);
  }
  return result;
}
