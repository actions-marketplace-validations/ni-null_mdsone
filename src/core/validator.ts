// ============================================================
// src/core/validator.ts — 設定邏輯驗證純函數
// 對應 Python src/validator.py（僅驗邏輯，不碰 fs）
// 核心層：零 I/O 依賴
// ============================================================

import type { Config, ValidationResult } from "./types.js";

/**
 * 驗證 Config 中的邏輯規則（純函數，不做任何 I/O）。
 * 資料夾是否存在的 fs 驗證由 Node adapter 的 config_loader 負責。
 */
export function validateConfig(config: Config): ValidationResult {
  const errors: string[] = [];

  if (!config.default_template || config.default_template.trim() === "") {
    errors.push("Default template is not configured.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
