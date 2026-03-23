# NPM Usage

`mdsone` can be used as a library, not only as a CLI tool.

## Install

```bash
npm install mdsone
```

## Public Entry Points

- `mdsone/core` - core conversion/build functions
- `mdsone/node` - Node I/O adapters (template/file loading)
- `mdsone/plugins/*` - plugin-specific APIs

Available plugin subpaths:

- `mdsone/plugins/code-highlight`
- `mdsone/plugins/katex`
- `mdsone/plugins/code-copy`
- `mdsone/plugins/code-line-number`
- `mdsone/plugins/image` (Node-oriented)
- `mdsone/plugins/minify`

## Core + Node Example

```ts
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import {
  DEFAULT_CONFIG,
  markdownToHtml,
  buildHtml,
  getAllTemplateStrings,
} from "mdsone/core";
import { loadTemplateFiles, loadLocaleFile } from "mdsone/node";

const mdText = await readFile("./README.md", "utf8");
const templateRoot = path.resolve("./templates");
const templateName = "normal";
const localeRoot = path.resolve("./locales");

const templateData = await loadTemplateFiles(templateRoot, templateName);
const localeFile = await loadLocaleFile(localeRoot, "en");

const bodyHtml = markdownToHtml(mdText, 0);

const html = buildHtml({
  config: {
    ...DEFAULT_CONFIG,
    template: templateName,
    template_variant: "default",
    site_title: "My Docs",
    i18n_mode: false,
  },
  templateData,
  documents: { index: bodyHtml },
  i18nStrings: getAllTemplateStrings(localeFile, "2026.03.19"),
});

await writeFile("./output.html", html, "utf8");
```

## Compose Plugins Manually

```ts
import { markdownToHtml, DEFAULT_CONFIG } from "mdsone/core";
import { codeHighlight, codeHighlightAssets } from "mdsone/plugins/code-highlight";
import { codeCopy, codeCopyAssets } from "mdsone/plugins/code-copy";
import { codeLineNumber, codeLineNumberAssets } from "mdsone/plugins/code-line-number";

let result = markdownToHtml("```bash\nnpx mdsone\n```", 0);
result = await codeHighlight(result);
result = await codeCopy(result, { mode: "line" });
result = await codeLineNumber(result);

const codeHighlightLib = await codeHighlightAssets();
const codeCopyLib = await codeCopyAssets({ mode: "line" });
const codeLineNumberLib = await codeLineNumberAssets();

// Plugin assets are file-based in dev versions.
// Runtime CLI resolves and inlines these automatically.
const libCssFiles = [
  ...(codeHighlightLib.cssFiles ?? []),
  ...(codeCopyLib.cssFiles ?? []),
  ...(codeLineNumberLib.cssFiles ?? []),
];
const libJsFiles = [
  ...(codeCopyLib.jsFiles ?? []),
  ...(codeLineNumberLib.jsFiles ?? []),
];
```

## Browser Use

- `mdsone/core` can be used in browser-side markdown rendering flows.
- `mdsone/node` is Node-only.
- `image` plugin is designed for Node file/network processing.
- Other plugins can be composed as HTML post-processors when needed.
- `code*Assets()` now returns `cssFiles/jsFiles` (file paths), not inline tag strings.
