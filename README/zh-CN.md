<p align="center">
  <img width="160" height="160" alt="mdsone" src="https://github.com/user-attachments/assets/bfa9fe31-4bd2-4568-aa45-f40d16564b97" />
</p>

<h1 align="center">mdsone — Markdown 转自包含式 HTML</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/mdsone"><img alt="npm version" src="https://img.shields.io/npm/v/mdsone?logo=npm" /></a>
  <a href="https://www.npmjs.com/package/mdsone"><img alt="node" src="https://img.shields.io/node/v/mdsone?logo=node.js" /></a>
  <a href="https://github.com/ni-null/mdsone/actions/workflows/deploy-docs.yml"><img alt="docs build" src="https://img.shields.io/github/actions/workflow/status/ni-null/mdsone/deploy-docs.yml?label=docs%20build" /></a>
  <a href="../LICENSE"><img alt="license" src="https://img.shields.io/github/license/ni-null/mdsone" /></a>
</p>

Language: [English](../README.md) | [繁體中文](./zh-TW.md) | 简体中文 | [日本語](./ja.md) | [한국어](./ko.md)

mdsone 是一款 Markdown 转换工具，可将 Markdown 文档转换为功能完整的自包含式 HTML 文件。

## 功能特性

- 🚀 **零依赖交付**：无需服务器或网络，单一 HTML 文件可直接在任何设备的任何浏览器中打开
- 📝 **Markdown 支持**：完整支持 CommonMark 标准语法
- 🎨 **内置模板**：包含多种响应式 HTML 模板
- 🌍 **国际化**：支持多语言文档（i18n）
- 📦 **自包含**：生成的 HTML 包含所有必要的 CSS 与资源
- 🖼️ **图片管理**：可将本地与远端图片嵌入为 base64（支持可选的缩放与压缩）
- ⚙️ **灵活配置**：支持 TOML 配置文件与 CLI 选项
- 🧰 **CLI 优先工作流**：专注于直接使用命令行进行文档交付

## 快速开始

单一 Markdown 文件：

```bash
npx mdsone README.md
```

指定输出：

```bash
npx mdsone README.md -o index.html
```

多个 Markdown 文件（批处理模式）：

```bash
npx mdsone ./docs -o ./dist
```

合并多个文件为单一 HTML：

```bash
npx mdsone intro.md guide.md -m -o manual.html
# 或合并整个文件夹
npx mdsone ./docs -m -o manual.html
```

包含图片嵌入：

```bash
npx mdsone README.md -o index.html --img-embed=base64 --img-max-width 400
```

关闭数学公式（KaTeX）：

```bash
npx mdsone README.md --katex=off
```

## CLI 参数

```text
Arguments:
  inputs                                输入：单一文件、多文件，或单一文件夹

Options:
  -v, --version                         显示版本
  -m, --merge                           合并所有输入为单一 HTML
  -o, --output <PATH>                   输出 HTML 路径
  -f, --force                           覆盖已存在的输出文件
  -t, --template <NAME|PATH[@VARIANT]>  模板名称或路径（可带变体，例如 normal@warm-cream）
  --title <TEXT>                        文档站点标题（默认：Documentation）
  -i, --i18n-mode [CODE]                启用多语言模式；可用 --i18n-mode=CODE（例如 --i18n-mode=zh-TW）
  -c, --config <PATH>                   指定 config.toml 路径
  -h, --help                            显示帮助

Plugins:
  --img-embed <off|base64>              图片嵌入模式（--img-embed=base64|off）
  --img-max-width <pixels>              图片最大宽度（需安装 sharp）
  --img-compress <1-100>                图片压缩质量 1-100（需安装 sharp）
  --katex [mode]                        KaTeX 模式（默认自动；--katex=full 使用完整字体；--katex=off 关闭）
  --code-highlight <off>                关闭语法高亮（--code-highlight=off）
  --code-copy <off|line|cmd>            复制按钮模式（--code-copy=off|line|cmd）
  --code-line-number [off]              显示行号（--code-line-number 或 --code-line-number=off）
  --minify [off]                        输出压缩（默认关闭；--minify 或 --minify=off）
```

## 致谢

mdsone 使用了许多优秀的开源套件：

- `markdown-it` 生态（`markdown-it`、`markdown-it-anchor`、`markdown-it-attrs`）
- `markdown-it-katex` + `katex`
- `shiki`
- `highlight.js`
- `cheerio`
- `sharp`（可选）
- `commander`
- `@iarna/toml`
