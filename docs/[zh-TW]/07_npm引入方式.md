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
  - `mdsone/plugins/shiki`
  - `mdsone/plugins/copy`
  - `mdsone/plugins/line-number`
  - `mdsone/plugins/image`（Node-only）

## Plugin 單獨調用（鏈式）

```ts
import { shiki } from "mdsone/plugins/shiki";
import { copy } from "mdsone/plugins/copy";
import { lineNumber } from "mdsone/plugins/line-number";

let result = "<pre><code class=\"language-bash\">npx mdsone</code></pre>";
result = await shiki(result);
result = await copy(result, { mode: "line" });
result = await lineNumber(result);
```

如需樣式或腳本，請同時注入 plugin 的 assets：

```ts
import { copyAssets } from "mdsone/plugins/copy";
import { lineNumberAssets } from "mdsone/plugins/line-number";

const copyLib = await copyAssets({ mode: "line" });
const lnLib = await lineNumberAssets();
const libCss = `${copyLib.css ?? ""}\n${lnLib.css ?? ""}`;
const libJs = `${copyLib.js ?? ""}\n${lnLib.js ?? ""}`;
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
  DEFAULT_CONFIG.markdown_extensions,
  true,
  0,
);

const html = buildHtml({
  config: {
    ...DEFAULT_CONFIG,
    default_template: templateName,
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

const html = markdownToHtml(md, DEFAULT_CONFIG.markdown_extensions, true, 0);
document.querySelector("#preview")!.innerHTML = html;
```

### 搭配 plugin 的完整範例（Web）

```ts
import { markdownToHtml, DEFAULT_CONFIG } from "mdsone/core";
import { shiki, shikiAssets } from "mdsone/plugins/shiki";
import { copy, copyAssets } from "mdsone/plugins/copy";
import { lineNumber, lineNumberAssets } from "mdsone/plugins/line-number";

function injectAssets(css?: string, js?: string) {
  if (css) document.head.insertAdjacentHTML("beforeend", css);
  if (js) {
    const container = document.createElement("div");
    container.innerHTML = js;
    container.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script");
      script.textContent = oldScript.textContent ?? "";
      document.body.appendChild(script);
    });
  }
}

const md = `
\`\`\`bash
npx mdsone ./docs -m --code-copy=cmd
\`\`\`
`;

let result = markdownToHtml(md, DEFAULT_CONFIG.markdown_extensions, true, 0);
result = await shiki(result);
result = await copy(result, { mode: "line" });
result = await lineNumber(result);

const shikiLib = await shikiAssets();
const copyLib = await copyAssets({ mode: "line" });
const lnLib = await lineNumberAssets();

injectAssets(
  `${shikiLib.css ?? ""}\n${copyLib.css ?? ""}\n${lnLib.css ?? ""}`,
  `${copyLib.js ?? ""}\n${lnLib.js ?? ""}`,
);

document.querySelector("#preview")!.innerHTML = result;
```

## 注意

- `mdsone/core` 只負責核心轉換與組裝，不會自動執行 plugins。
- Web 可手動串接 `shiki`、`copy`、`line-number`，並自行注入 assets。
- `image` plugin 依賴 Node.js（`fs/path` 與處理流程），屬於 Node-only。
