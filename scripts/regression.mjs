import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distCli = path.join(rootDir, "dist", "cli.js");
const fixturesDir = path.join(__dirname, "regression-fixtures");
const baselinePath = path.join(__dirname, "regression-baseline.json");
const outputRoot = path.join(__dirname, ".regression-output");
const fixedBuildDate = "2026.01.01";
const updateMode = process.argv.includes("--update");

const baseEnv = {
  ...process.env,
  BUILD_DATE: fixedBuildDate,
  MDSONE_UNICODE: "0",
  NO_COLOR: "1",
};

/** @param {string} cmd */
function runNodeCli(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: rootDir,
    env: baseEnv,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    const stdout = (result.stdout || "").trim();
    throw new Error(
      `Command failed: ${cmd} ${args.join(" ")}\n${stdout}\n${stderr}`.trim(),
    );
  }
}

async function ensureDistCli() {
  try {
    await fs.access(distCli);
  } catch {
    throw new Error("dist/cli.js not found. Run `npm run build` first.");
  }
}

async function rmIfExists(target) {
  await fs.rm(target, { recursive: true, force: true });
}

async function sha256File(filePath) {
  const data = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await listFilesRecursive(abs));
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
  out.sort();
  return out;
}

async function captureOutputShape(targetPath) {
  const stat = await fs.stat(targetPath);
  if (stat.isFile()) {
    const rel = path.basename(targetPath);
    return { [rel]: await sha256File(targetPath) };
  }
  const files = await listFilesRecursive(targetPath);
  const shape = {};
  for (const abs of files) {
    const rel = path.relative(targetPath, abs).replace(/\\/g, "/");
    shape[rel] = await sha256File(abs);
  }
  return shape;
}

async function runScenarios() {
  await ensureDistCli();
  await rmIfExists(outputRoot);
  await fs.mkdir(outputRoot, { recursive: true });

  const scenarios = [
    {
      id: "single-file",
      run: () => runNodeCli("node", [
        distCli,
        path.join(fixturesDir, "single", "README.md"),
        "-o",
        path.join(outputRoot, "single.html"),
        "--force",
      ]),
      outputPath: path.join(outputRoot, "single.html"),
    },
    {
      id: "merge-files",
      run: () => runNodeCli("node", [
        distCli,
        path.join(fixturesDir, "merge-files", "a.md"),
        path.join(fixturesDir, "merge-files", "b.md"),
        "-m",
        "-o",
        path.join(outputRoot, "merge-files.html"),
        "--force",
      ]),
      outputPath: path.join(outputRoot, "merge-files.html"),
    },
    {
      id: "merge-folder",
      run: () => runNodeCli("node", [
        distCli,
        path.join(fixturesDir, "merge-folder"),
        "-m",
        "-o",
        path.join(outputRoot, "merge-folder.html"),
        "--force",
      ]),
      outputPath: path.join(outputRoot, "merge-folder.html"),
    },
    {
      id: "i18n-merge",
      run: () => runNodeCli("node", [
        distCli,
        path.join(fixturesDir, "i18n-docs"),
        "-m",
        "--i18n-mode=en",
        "-o",
        path.join(outputRoot, "i18n.html"),
        "--force",
      ]),
      outputPath: path.join(outputRoot, "i18n.html"),
    },
    {
      id: "batch-folder",
      run: () => runNodeCli("node", [
        distCli,
        path.join(fixturesDir, "batch-folder"),
        "-o",
        path.join(outputRoot, "batch"),
        "--force",
      ]),
      outputPath: path.join(outputRoot, "batch"),
    },
  ];

  const report = {
    meta: {
      build_date: fixedBuildDate,
      generated_at_utc: new Date().toISOString(),
    },
    scenarios: {},
  };

  for (const scenario of scenarios) {
    scenario.run();
    report.scenarios[scenario.id] = await captureOutputShape(scenario.outputPath);
  }

  return report;
}

async function readBaseline() {
  const raw = await fs.readFile(baselinePath, "utf8");
  return JSON.parse(raw);
}

function stableView(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const report = await runScenarios();

  if (updateMode) {
    await fs.writeFile(baselinePath, stableView(report) + "\n", "utf8");
    console.log(`Updated baseline: ${path.relative(rootDir, baselinePath)}`);
    return;
  }

  let baseline;
  try {
    baseline = await readBaseline();
  } catch {
    throw new Error(
      `Baseline not found. Run: node ${path.relative(rootDir, path.join(__dirname, "regression.mjs"))} --update`,
    );
  }

  const expected = { ...baseline, meta: { ...baseline.meta, generated_at_utc: "ignored" } };
  const actual = { ...report, meta: { ...report.meta, generated_at_utc: "ignored" } };

  if (stableView(expected) !== stableView(actual)) {
    throw new Error(
      `Regression mismatch.\nExpected:\n${stableView(expected)}\n\nActual:\n${stableView(actual)}`,
    );
  }

  console.log("Regression check passed.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

