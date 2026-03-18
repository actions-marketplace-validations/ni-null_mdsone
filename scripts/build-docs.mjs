#!/usr/bin/env node

import { execSync } from "child_process";
import { mkdirSync } from "fs";

function run(command, description) {
  try {
    console.log(`\n${description}`);
    execSync(command, { stdio: "inherit", shell: true });
  } catch {
    console.error(`Failed: ${description}`);
    process.exit(1);
  }
}

console.log("Creating output directory...");
mkdirSync("docs-dist", { recursive: true });

run(
  'npx mdsone ./docs --i18n-mode=zh-TW --template normal --site-title "MDSone Documentation" -o ./docs-dist/index.html',
  "Building multi-language documentation...",
);

console.log("\nDone. Output directory: ./docs-dist");
console.log("Generated: index.html");
