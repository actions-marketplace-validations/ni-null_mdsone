<p align="center">
  <img width="160" height="160" alt="mdsone" src="https://github.com/user-attachments/assets/bfa9fe31-4bd2-4568-aa45-f40d16564b97" />
</p>

<h1 align="center">mdsone — Markdown 轉自包含式 HTML</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/mdsone"><img alt="npm version" src="https://img.shields.io/npm/v/mdsone?logo=npm" /></a>
  <a href="https://www.npmjs.com/package/mdsone"><img alt="node" src="https://img.shields.io/node/v/mdsone?logo=node.js" /></a>
  <a href="https://github.com/ni-null/mdsone/actions/workflows/deploy-docs.yml"><img alt="docs build" src="https://img.shields.io/github/actions/workflow/status/ni-null/mdsone/deploy-docs.yml?label=docs%20build" /></a>
  <a href="../LICENSE"><img alt="license" src="https://img.shields.io/github/license/ni-null/mdsone" /></a>
</p>

Language: [English](../README.md) | 繁體中文 | [简体中文](./zh-CN.md) | [日本語](./ja.md) | [한국어](./ko.md)

mdsone 是一款 Markdown 轉換工具，可將 Markdown 文件轉換為功能完整的自包含式 HTML 檔案。

## 功能特色

- 🚀 **零依賴交付**：無需伺服器或網路，單一 HTML 檔案可直接在任何裝置的任何瀏覽器中開啟
- 📝 **Markdown 支援**：完整支援 CommonMark 標準語法
- 🎨 **內建模板**：包含多種響應式 HTML 模板
- 🌍 **國際化**：支援多語言文件（i18n）
- 📦 **自包含**：產生的 HTML 包含所有必要的 CSS 與資源
- 🖼️ **圖片管理**：可將本地與遠端圖片嵌入為 base64（支援可選的縮放與壓縮）
- ⚙️ **彈性設定**：支援 TOML 設定檔與 CLI 選項
- 🧰 **CLI 優先工作流**：專注於直接使用命令列進行文件交付

## 快速開始

單一 Markdown 檔案：

```bash
npx mdsone README.md
```

指定輸出：

```bash
npx mdsone README.md -o index.html
```

多個 Markdown 檔案（批次模式）：

```bash
npx mdsone ./docs -o ./dist
```

合併多個檔案為單一 HTML：

```bash
npx mdsone intro.md guide.md -m -o manual.html
# 或合併整個資料夾
npx mdsone ./docs -m -o manual.html
```

含圖片嵌入：

```bash
npx mdsone README.md -o index.html --img-embed=base64 --img-max-width 400
```

關閉數學公式（KaTeX）：

```bash
npx mdsone README.md --katex=off
```

## CLI 參數

```text
Arguments:
  inputs                                輸入來源：單一檔案、多檔案，或單一資料夾

Options:
  -v, --version                         顯示版本
  -m, --merge                           合併所有輸入為單一 HTML
  -o, --output <PATH>                   輸出 HTML 路徑
  -f, --force                           覆寫既有輸出檔案
  -t, --template <NAME|PATH[@VARIANT]>  範本名稱或路徑（可附變體，例如 normal@warm-cream）
  --title <TEXT>                        文件站點標題（預設：Documentation）
  -i, --i18n-mode [CODE]                啟用多語模式；可用 --i18n-mode=CODE（例如 --i18n-mode=zh-TW）
  -c, --config <PATH>                   指定 config.toml 路徑
  -h, --help                            顯示說明

Plugins:
  --img-embed <off|base64>              圖片嵌入模式（--img-embed=base64|off）
  --img-max-width <pixels>              圖片最大寬度（需安裝 sharp）
  --img-compress <1-100>                圖片壓縮品質 1-100（需安裝 sharp）
  --katex [mode]                        KaTeX 模式（預設自動；--katex=full 使用完整字體；--katex=off 關閉）
  --code-highlight <off>                關閉語法高亮（--code-highlight=off）
  --code-copy <off|line|cmd>            複製按鈕模式（--code-copy=off|line|cmd）
  --code-line-number [off]              顯示行號（--code-line-number 或 --code-line-number=off）
  --minify [off]                        輸出壓縮（預設關閉；--minify 或 --minify=off）
```

## 致謝

mdsone 使用了許多優秀的開源套件：

- `markdown-it` 生態系（`markdown-it`、`markdown-it-anchor`、`markdown-it-attrs`）
- `markdown-it-katex` + `katex`
- `shiki`
- `highlight.js`
- `cheerio`
- `sharp`（可選）
- `commander`
- `@iarna/toml`
