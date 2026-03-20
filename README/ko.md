<p align="center">
  <img width="160" height="160" alt="mdsone" src="https://github.com/user-attachments/assets/bfa9fe31-4bd2-4568-aa45-f40d16564b97" />
</p>

<h1 align="center">mdsone - Markdown 를 단일 HTML 로 변환</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/mdsone"><img alt="npm version" src="https://img.shields.io/npm/v/mdsone?logo=npm" /></a>
  <a href="https://www.npmjs.com/package/mdsone"><img alt="node" src="https://img.shields.io/node/v/mdsone?logo=node.js" /></a>
  <a href="https://github.com/ni-null/mdsone/actions/workflows/deploy-docs.yml"><img alt="docs build" src="https://img.shields.io/github/actions/workflow/status/ni-null/mdsone/deploy-docs.yml?label=docs%20build" /></a>
  <a href="../LICENSE"><img alt="license" src="https://img.shields.io/github/license/ni-null/mdsone" /></a>
</p>

Language: [English](../README.md) | [繁體中文](./zh-TW.md) | [简体中文](./zh-CN.md) | [日本語](./ja.md) | 한국어

mdsone 는 Markdown 문서를 기능이 포함된 단일 HTML(오프라인에서 열 수 있는 self-contained 파일)로 변환하는 도구입니다.

## 주요 기능

- 🚀 **단일 HTML 배포**: 서버/인터넷 없이 단일 HTML을 어떤 기기에서도 브라우저로 바로 열 수 있습니다.
- 📝 **Markdown 지원**: CommonMark + markdown-it 생태계.
- 🎨 **내장 템플릿**: 반응형 HTML 템플릿 포함.
- 🌍 **다국어**: i18n 지원.
- 📦 **자체 포함**: 필요한 CSS/자산을 함께 포함.
- 🖼️ **이미지 처리**: 로컬/원격 이미지를 base64로 임베드(옵션: 리사이즈/압축).
- ⚙️ **설정**: TOML 및 CLI 옵션 지원.
- 🧰 **CLI 우선**: 문서 배포를 위한 CLI 워크플로.

## 빠른 시작

단일 Markdown 파일:

```bash
npx mdsone README.md
```

출력 지정:

```bash
npx mdsone README.md -o index.html
```

여러 파일(배치):

```bash
npx mdsone ./docs -o ./dist
```

여러 파일을 하나로 병합:

```bash
npx mdsone intro.md guide.md -m -o manual.html

# 폴더 전체 병합
npx mdsone ./docs -m -o manual.html
```

수식(KaTeX) 비활성화:

```bash
npx mdsone README.md --katex=off
```

## CLI 파라미터

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

## 감사의 말

mdsone 는 다음 OSS에 기반합니다:

- `markdown-it`( `markdown-it`, `markdown-it-anchor`, `markdown-it-attrs` )
- `markdown-it-katex` + `katex`
- `shiki`
- `highlight.js`
- `cheerio`
- `sharp`(선택)
- `commander`
- `@iarna/toml`
