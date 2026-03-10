import { defineConfig } from "tsup";

export default defineConfig([
  // ── CLI entry ───────────────────────────────────────────
  {
    entry: { cli: "src/cli/main.ts" },
    format: ["esm"],
    outDir: "dist",
    target: "node18",
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: true,
    // 不打包 dependencies — 保持 external
    external: [
      "@iarna/toml",
      "commander",
      "dotenv",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
  // ── Core library entry（純函數，zero I/O）──────────────
  {
    entry: { index: "src/core/index.ts" },
    format: ["esm"],
    outDir: "dist",
    target: "node18",
    platform: "node",
    splitting: false,
    clean: false, // 不清除上一步產出
    dts: true,
    sourcemap: true,
    external: [
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
  // ── Node adapter entry（I/O 層）────────────────────────
  {
    entry: { node: "src/adapters/node/index.ts" },
    format: ["esm"],
    outDir: "dist",
    target: "node18",
    platform: "node",
    splitting: false,
    clean: false,
    dts: true,
    sourcemap: true,
    external: [
      "@iarna/toml",
      "commander",
      "dotenv",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
]);
