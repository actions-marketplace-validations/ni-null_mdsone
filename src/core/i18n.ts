// ============================================================
// src/core/i18n.ts — 國際化純函數層
// 對應 Python src/i18n.py（去除 I/O，接收已讀取的 I18nFile 物件）
// 核心層：零 I/O 依賴
// ============================================================

import type { I18nFile } from "./types.js";

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
