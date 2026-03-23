// ============================================================
// src/core/validator.ts
// Core config validation helpers.
// ============================================================

import type { Config, ValidationIssue, ValidationResult } from "./types.js";

/** Collect structured validation issues for core config preflight. */
export function collectConfigValidationIssues(config: Config): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!config.template || config.template.trim() === "") {
    issues.push({
      level: "error",
      code: "core.template.required",
      message: "Template is not configured.",
      hint: "Set --template or configure [build].template in config.toml.",
    });
  }

  return issues;
}

/** Backward-compatible boolean validation view. */
export function validateConfig(config: Config): ValidationResult {
  const errors = collectConfigValidationIssues(config)
    .filter((issue) => issue.level === "error")
    .map((issue) => issue.message);

  return {
    valid: errors.length === 0,
    errors,
  };
}
