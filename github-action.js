import { appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const TRUE_SET = new Set(["1", "true", "yes", "on"]);
const FALSE_SET = new Set(["0", "false", "no", "off"]);

function getInput(name, fallback = "") {
  const key = `INPUT_${name.toUpperCase()}`;
  return (process.env[key] ?? fallback).trim();
}

function isTrue(value) {
  return TRUE_SET.has(value.toLowerCase());
}

function isFalse(value) {
  return FALSE_SET.has(value.toLowerCase());
}

function pushIfValue(args, flag, value) {
  if (value) {
    args.push(flag, value);
  }
}

function pushEqIfValue(args, flag, value) {
  if (value) {
    args.push(`${flag}=${value}`);
  }
}

function pushModeFlag(args, flag, value) {
  const v = value.toLowerCase();
  if (!v) return;
  if (isTrue(v)) {
    args.push(flag);
    return;
  }
  if (isFalse(v)) {
    args.push(`${flag}=off`);
    return;
  }
  args.push(`${flag}=${value}`);
}

function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  appendFileSync(outputPath, `${name}=${value}\n`, "utf8");
}

function parseSourceInput(source) {
  if (!source) return [];
  return source
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function main() {
  const source = getInput("SOURCE", "README.md");
  const output = getInput("OUTPUT");
  const merge = getInput("MERGE", "false");
  const force = getInput("FORCE", "true");
  const template = getInput("TEMPLATE");
  const title = getInput("TITLE");
  const i18nMode = getInput("I18N_MODE", "false");
  const config = getInput("CONFIG");
  const imgEmbed = getInput("IMG_EMBED");
  const imgMaxWidth = getInput("IMG_MAX_WIDTH");
  const imgCompress = getInput("IMG_COMPRESS");
  const katex = getInput("KATEX");
  const codeHighlight = getInput("CODE_HIGHLIGHT");
  const codeCopy = getInput("CODE_COPY");
  const codeLineNumber = getInput("CODE_LINE_NUMBER");
  const minify = getInput("MINIFY");
  const cliVersion = getInput("CLI_VERSION", "latest");

  const args = [];
  args.push(...parseSourceInput(source));

  if (isTrue(merge)) args.push("-m");
  if (isTrue(force)) args.push("-f");
  pushIfValue(args, "-o", output);
  pushIfValue(args, "-t", template);
  pushIfValue(args, "--title", title);
  pushIfValue(args, "-c", config);

  if (i18nMode) {
    const v = i18nMode.toLowerCase();
    if (isTrue(v)) {
      args.push("-i");
    } else if (!isFalse(v)) {
      args.push(`--i18n-mode=${i18nMode}`);
    }
  }

  if (imgEmbed) {
    pushEqIfValue(args, "--img-embed", imgEmbed);
  }
  pushIfValue(args, "--img-max-width", imgMaxWidth);
  pushIfValue(args, "--img-compress", imgCompress);

  if (katex) {
    const v = katex.toLowerCase();
    if (isTrue(v)) args.push("--katex");
    else if (isFalse(v)) args.push("--katex=off");
    else args.push(`--katex=${katex}`);
  }

  if (codeHighlight) {
    const v = codeHighlight.toLowerCase();
    if (isFalse(v)) args.push("--code-highlight=off");
  }

  if (codeCopy) {
    args.push(`--code-copy=${codeCopy}`);
  }

  if (codeLineNumber) {
    pushModeFlag(args, "--code-line-number", codeLineNumber);
  }

  if (minify) {
    pushModeFlag(args, "--minify", minify);
  }

  const pkg = `mdsone@${cliVersion}`;
  const cmdArgs = ["exec", "--yes", "--package", pkg, "--", "mdsone", ...args];
  console.log(`[mdsone-action] npm ${cmdArgs.join(" ")}`);

  const result = spawnSync("npm", cmdArgs, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (output) {
    setOutput("output_path", output);
  }

  if (result.error) {
    console.error(`[mdsone-action] Failed to run npm exec: ${result.error.message}`);
    process.exit(1);
  }
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

main();
