import { defineConfig } from "tsup";

export default defineConfig([
  // CLI entry
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
    // Keep runtime deps external.
    external: [
      "@iarna/toml",
      "commander",
      "html-minifier-terser",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
  // Core library entry (pure functions, zero I/O)
  {
    entry: { index: "src/core/index.ts" },
    format: ["esm"],
    outDir: "dist",
    target: "node18",
    platform: "node",
    splitting: false,
    clean: false,
    dts: true,
    sourcemap: true,
    external: [
      "html-minifier-terser",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
  // Node adapter entry (I/O layer)
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
      "html-minifier-terser",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
  // Plugin entries (each plugin owns its own public API)
  {
    entry: {
      "plugins/shiki": "plugins/shiki/index.ts",
      "plugins/copy": "plugins/copy/index.ts",
      "plugins/image": "plugins/image/index.ts",
      "plugins/line-number": "plugins/line-number/index.ts",
      "plugins/minify": "plugins/minify/index.ts",
    },
    format: ["esm"],
    outDir: "dist",
    target: "node18",
    platform: "node",
    splitting: false,
    clean: false,
    dts: true,
    sourcemap: true,
    external: [
      "cheerio",
      "highlight.js",
      "shiki",
      "sharp",
      "html-minifier-terser",
      "markdown-it",
      "markdown-it-attrs",
    ],
  },
]);
