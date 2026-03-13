# CLI Reference

## Syntax

```
mdsone <inputs...> [-o output_path] [-f <boolean>]
```

## Arguments & Options

| Argument / Option | Description | Example |
|-------------------|-------------|---------|
| `<inputs...>` | Input: single file, multiple files, or single folder | `README.md` \| `f1.md f2.md` \| `./docs` |
| `-o, --output PATH` | Output HTML file path | `-o dist/index.html` |
| `-f, --force <boolean>` | Overwrite existing output file (default: `true`) | `-f false` |
| `--template NAME` | Template name | `--template minimal` |
| `--locale CODE` | Locale code (single-language mode) | `--locale en` |
| `--i18n-mode true\|false` | Enable/disable multi-language mode | `--i18n-mode true` |
| `--img-to-base64 true\|false` | Embed images as base64 (local + remote) | `--img-to-base64 true` |
| `--img-max-width PIXELS` | Limit image max width (requires sharp) | `--img-max-width 400` |
| `--img-compress QUALITY` | Image compression quality 1-100 (requires sharp) | `--img-compress 80` |

## Input Modes

### A. Single File

```bash
mdsone README.md
# Output: CWD/README.html (default)

mdsone README.md -o dist/index.html
```

### B. Multiple Files (merged in input order)

> ``-o`` is **required** when providing multiple files.

```bash
mdsone intro.md guide.md reference.md -o manual.html
```

### C. Single Folder (A-Z merge)

```bash
mdsone ./docs
# Output: CWD/docs.html (default)

mdsone ./docs -o dist/manual.html
```

> Mixed input (files + directories) is **not supported**.

## Overwrite Protection (`-f`)

| Flag | Behaviour |
|------|-----------|
| ``-f true`` (default) | Always overwrite the output file |
| ``-f false`` | Stop with an error if output already exists |

```bash
npx mdsone README.md -o output.html -f false
```

## Configuration Methods (Priority Order)

### 1. CLI Arguments (Highest Priority)

```bash
npx mdsone ./docs -o ./dist/index.html --i18n-mode false
```

### 2. Environment Variables

```bash
export MARKDOWN_SOURCE_DIR="./docs"
export OUTPUT_FILE="./dist/index.html"
export I18N_MODE="false"
npx mdsone
```

CI environment (e.g. GitHub Actions):

```yaml
env:
  MARKDOWN_SOURCE_DIR: "./docs"
  OUTPUT_FILE: "./dist/index.html"
  I18N_MODE: "true"
  SITE_TITLE: "My Documentation"
steps:
  - run: npm ci
  - run: npx mdsone
```

### 3. config.toml (Recommended for Local Development)

```toml
[paths]
source = "./docs"
output_file = "./dist/index.html"

[build]
default_template = "normal"
img_to_base64 = true
img_max_width = 600
img_compress = 90

[i18n]
mode = true
default_locale = "en"
```

```bash
npx mdsone
npm start
```

### 4. Default Values

If none of the above are set, built-in default values are used.

## Argument-to-Configuration Mapping

| Feature | CLI | Environment Variable | config.toml |
|---------|-----|----------------------|-------------|
| Source input | `<inputs...>` | `MARKDOWN_SOURCE_DIR` | `[paths] source` |
| Output path | `-o, --output` | `OUTPUT_FILE` | `[paths] output_file` |
| Template | `--template` | `DEFAULT_TEMPLATE` | `[build] default_template` |
| Locale | `--locale` | `LOCALE` | `[i18n] locale` |
| Multi-language mode | `--i18n-mode` | `I18N_MODE` | `[i18n] mode` |
| Default locale | `--default-locale` | `DEFAULT_LOCALE` | `[i18n] default_locale` |
| Page title | `--site-title` | `SITE_TITLE` | `[site] title` |
| Theme | `--theme-mode` | `THEME_MODE` | `[site] theme_mode` |
| Minify HTML | `--minify-html` | `MINIFY_HTML` | `[build] minify_html` |
| Build date | - | `BUILD_DATE` | `[build] build_date` |
| Image base64 embed | `--img-to-base64` | `IMG_TO_BASE64` | `[build] img_to_base64` |
| Image max width | `--img-max-width` | `IMG_MAX_WIDTH` | `[build] img_max_width` |
| Image compression quality | `--img-compress` | `IMG_COMPRESS` | `[build] img_compress` |

## Usage Examples

```bash
# Single file
npx mdsone README.md
npx mdsone README.md -o dist/index.html

# Multiple files merged in order (-o required)
npx mdsone intro.md guide.md -o manual.html

# Folder (A-Z merge)
npx mdsone ./docs
npx mdsone ./docs -o dist/manual.html --template normal

# Multi-language mode (folder only)
npx mdsone ./docs --i18n-mode true --default-locale zh-TW

# Embed images as base64 (no resize)
npx mdsone ./docs -o dist/index.html --img-to-base64 true

# Embed images with resize + compression (requires sharp)
npx mdsone ./docs -o dist/index.html --img-to-base64 true --img-max-width 600 --img-compress 90

# Overwrite protection
npx mdsone README.md -o output.html -f false
```