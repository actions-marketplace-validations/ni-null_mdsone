// ============================================================
// src/core/value-parsers.ts
// Shared parsers for CLI/ENV/TOML value normalization.
// ============================================================

/**
 * Parse loose boolean-like values.
 * Accepts: true/false/on/off/1/0/yes/no (case-insensitive).
 */
export function parseBooleanLike(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") return raw;
  if (typeof raw !== "string") return undefined;
  const value = raw.trim().toLowerCase();
  if (value === "true" || value === "on" || value === "1" || value === "yes") return true;
  if (value === "false" || value === "off" || value === "0" || value === "no") return false;
  return undefined;
}

/**
 * Parse enum-like string with optional aliases.
 * Matching is case-insensitive.
 */
export function parseEnumLike<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  aliases?: Record<string, T>,
): T | undefined {
  if (typeof raw !== "string") return undefined;
  const value = raw.trim().toLowerCase();
  if (!value) return undefined;

  for (const item of allowed) {
    if (item.toLowerCase() === value) return item;
  }
  if (aliases && aliases[value] !== undefined) return aliases[value];
  return undefined;
}

/**
 * Parse integer-like input from number/string.
 */
export function parseIntegerLike(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isInteger(raw)) return raw;
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}
