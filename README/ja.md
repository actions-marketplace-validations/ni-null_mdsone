<p align="center">
  <img width="160" height="160" alt="mdsone" src="https://github.com/user-attachments/assets/bfa9fe31-4bd2-4568-aa45-f40d16564b97" />
</p>

<h1 align="center">mdsone - Markdown を単一 HTML に変換</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/mdsone"><img alt="npm version" src="https://img.shields.io/npm/v/mdsone?logo=npm" /></a>
  <a href="https://www.npmjs.com/package/mdsone"><img alt="node" src="https://img.shields.io/node/v/mdsone?logo=node.js" /></a>
  <a href="https://github.com/ni-null/mdsone/actions/workflows/deploy-docs.yml"><img alt="docs build" src="https://img.shields.io/github/actions/workflow/status/ni-null/mdsone/deploy-docs.yml?label=docs%20build" /></a>
  <a href="../LICENSE"><img alt="license" src="https://img.shields.io/github/license/ni-null/mdsone" /></a>
</p>

Language: [English](../README.md) | [繁體中文](./zh-TW.md) | [简体中文](./zh-CN.md) | 日本語 | [한국어](./ko.md)

mdsone は Markdown を機能付きの単一 HTML（オフラインで開ける自己完結ファイル）に変換するツールです。

## 特徴

- 🚀 **単一 HTML で配布**：サーバー不要、ネット不要。1 つの HTML をどの端末でもブラウザで開けます。
- 📝 **Markdown 対応**：CommonMark + markdown-it エコシステム。
- 🎨 **内蔵テンプレート**：レスポンシブな HTML テンプレート。
- 🌍 **多言語対応**：i18n をサポート。
- 📦 **自己完結**：必要な CSS/アセットを同梱。
- 🖼️ **画像処理**：ローカル/リモート画像を base64 に埋め込み（リサイズ/圧縮は任意）。
- ⚙️ **設定**：TOML と CLI オプションに対応。
- 🧰 **CLI 優先**：ドキュメント配布向けの CLI ワークフロー。

## クイックスタート

単一 Markdown ファイル：

```bash
npx mdsone README.md
```

出力ファイルを指定：

```bash
npx mdsone README.md -o index.html
```

複数ファイル（バッチ）：

```bash
npx mdsone ./docs -o ./dist
```

複数ファイルを 1 つに結合：

```bash
npx mdsone intro.md guide.md -m -o manual.html

# フォルダ全体を結合
npx mdsone ./docs -m -o manual.html
```

数式（KaTeX）を無効化：

```bash
npx mdsone README.md --katex=off
```

## CLI パラメータ

```text
Arguments:
  inputs                                Input: single file, multiple files, or single folder path

Options:
  -v, --version                         Display version
  -m, --merge                           Merge all inputs into a single HTML output
  -o, --output <PATH>                   Output HTML file path
  -f, --force                           Overwrite existing output file
  -t, --template <NAME|PATH[@VARIANT]>  Template name/path with optional variant (e.g. normal@warm-cream)
  --title <TEXT>                        Documentation site title (default: Documentation)
  -i, --i18n-mode [CODE]                Enable multi-language mode; optional CODE via --i18n-mode=CODE (e.g. --i18n-mode=zh-TW)
  -c, --config <PATH>                   Specify config.toml path
  -h, --help                            display help for command

Plugins:
  --img-embed <off|base64>              Image embedding mode (use --img-embed=base64|off)
  --img-max-width <pixels>              Max image width in pixels (requires 'sharp' package)
  --img-compress <1-100>                Image compression quality 1-100 (requires 'sharp' package)
  --katex [mode]                        KaTeX mode (auto default; --katex=full for full fonts; --katex=off to disable)
  --code-highlight <off>                Disable syntax highlighting (use --code-highlight=off)
  --code-copy <off|line|cmd>            Copy button mode (use --code-copy=off|line|cmd)
  --code-line-number [off]              Show line numbers in code blocks (use --code-line-number or --code-line-number=off)
  --minify [off]                        Minify output HTML (default: off; use --minify or --minify=off)
```

## 謝辞

mdsone は次の OSS に支えられています：

- `markdown-it`（`markdown-it`、`markdown-it-anchor`、`markdown-it-attrs`）
- `markdown-it-katex` + `katex`
- `shiki`
- `highlight.js`
- `cheerio`
- `sharp`（任意）
- `commander`
- `@iarna/toml`
