// ============================================================
// src/core/build-date.ts
// Shared build date resolver for core and CLI.
// ============================================================

import type { Config } from "./types.js";

export function resolveBuildDate(config: Pick<Config, "build_date">): string {
  if (config.build_date) return config.build_date;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

