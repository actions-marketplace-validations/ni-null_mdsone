# NPM 引入方式

本篇補充「在程式碼中使用 mdsone」的最小方式。

## 安裝

```bash
npm install mdsone
```

## 匯入規則

- Core API：`mdsone/core`
- Node I/O API：`mdsone/node`
- Plugin API（各自獨立導出）：
  - `mdsone/plugins/katex`
  - `mdsone/plugins/code-highlight`
  - `mdsone/plugins/code-copy`
  - `mdsone/plugins/code-line-number`
  - `mdsone/plugins/image`（Node-only）
  - `mdsone/plugins/minify`

## Plugin 單獨調用（鏈式）

```ts
import { codeHighlight } from "mdsone/plugins/code-highlight";
import { codeCopy } from "mdsone/plugins/code-copy";
import { codeLineNumber } from "mdsone/plugins/code-line-number";

let result = "<pre><code class=\"language-bash\">npx mdsone</code></pre>";
result = await codeHighlight(result);
result = await codeCopy(result, { mode: "line" });
result = await codeLineNumber(result);
```

如需樣式或腳本，請同時注入 plugin 的 assets：

```ts
import { codeCopyAssets } from "mdsone/plugins/code-copy";
import { codeLineNumberAssets } from "mdsone/plugins/code-line-number";

const codeCopyLib = await codeCopyAssets({ mode: "line" });
const codeLineNumberLib = await codeLineNumberAssets();
const libCssFiles = [
  ...(codeCopyLib.cssFiles ?? []),
  ...(codeLineNumberLib.cssFiles ?? []),
];
const libJsFiles = [
  ...(codeCopyLib.jsFiles ?? []),
  ...(codeLineNumberLib.jsFiles ?? []),
];
```

## 單一 Markdown 轉 HTML（Node）

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

// 這裡使用你專案中的模板與語系檔路徑
const templateRoot = path.resolve("./templates");
const templateName = "normal";
const localeRoot = path.resolve("./locales");

const templateData = await loadTemplateFiles(templateRoot, templateName);
const localeFile = await loadLocaleFile(localeRoot, "zh-TW");

const bodyHtml = markdownToHtml(
  mdText,
  0,
);

const html = buildHtml({
  config: {
    ...DEFAULT_CONFIG,
    template: templateName,
    site_title: "My Docs",
    i18n_mode: false,
    template_variant: "default",
  },
  templateData,
  documents: { index: bodyHtml },
  i18nStrings: getAllTemplateStrings(localeFile, "2026.03.18"),
});

await writeFile("./output.html", html, "utf8");
```

## Web 前端用法

前端建議只使用 `mdsone/core`。  
`mdsone/node` 依賴 Node.js 檔案系統，不適用瀏覽器。

### 方式一：只把 Markdown 轉成 HTML 片段（最小用法）

```ts
import { markdownToHtml, DEFAULT_CONFIG } from "mdsone/core";

const md = `# Hello mdsone

- item 1
- item 2
`;

const html = markdownToHtml(md, 0);
document.querySelector("#preview")!.innerHTML = html;
```

### 搭配 plugin 的完整範例（Web）

```ts
import { markdownToHtml, DEFAULT_CONFIG } from "mdsone/core";
import { codeHighlight, codeHighlightAssets } from "mdsone/plugins/code-highlight";
import { codeCopy, codeCopyAssets } from "mdsone/plugins/code-copy";
import { codeLineNumber, codeLineNumberAssets } from "mdsone/plugins/code-line-number";

const md = `
\`\`\`bash
npx mdsone ./docs -m --code-copy=cmd
\`\`\`
`;

let result = markdownToHtml(md, 0);
result = await codeHighlight(result);
result = await codeCopy(result, { mode: "line" });
result = await codeLineNumber(result);

const codeHighlightLib = await codeHighlightAssets();
const codeCopyLib = await codeCopyAssets({ mode: "line" });
const codeLineNumberLib = await codeLineNumberAssets();

const libCssFiles = [
  ...(codeHighlightLib.cssFiles ?? []),
  ...(codeCopyLib.cssFiles ?? []),
  ...(codeLineNumberLib.cssFiles ?? []),
];
const libJsFiles = [
  ...(codeCopyLib.jsFiles ?? []),
  ...(codeLineNumberLib.jsFiles ?? []),
];

document.querySelector("#preview")!.innerHTML = result;
```

## 注意

- `mdsone/core` 只負責核心轉換與組裝，不會自動執行 plugins。
- Web 可手動串接 `code-highlight`、`code-copy`、`code-line-number`，並自行注入 assets。
- `image` plugin 依賴 Node.js（`fs/path` 與處理流程），屬於 Node-only。
- `minify` plugin 作用在「完整頁面 HTML」（`buildHtml()` 之後），不適用純片段 HTML。

