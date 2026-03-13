# CLI Reference

## 語法

```
mdsone <inputs...> [-o output_path] [-f <boolean>]
```

## 參數

| 參數 / 選項 | 說明 | 範例 |
| ----------------------- | --------------------------------- | ----------------------------- |
| `<inputs...>` | 輸入來源：單一檔、多個檔、或單一資料夾 | `README.md` \| `f1.md f2.md` \| `./docs` |
| `-o, --output PATH` | 輸出 HTML 路徑 | `-o dist/index.html` |
| `-f, --force <boolean>` | 覆蓋模式開關（預設 `true`） | `-f false` |
| `--template NAME` | 模板名稱 | `--template minimal` |
| `--locale CODE` | 語系代碼（單語模式） | `--locale zh-TW` |
| `--i18n-mode true\|false` | 啟用/關閉多語言模式 | `--i18n-mode false` |
| `--img-to-base64 true\|false` | 將圖片嵌入為 base64（本地+遠端） | `--img-to-base64 true` |
| `--img-max-width PIXELS` | 限制圖片最大寬度（需要 sharp） | `--img-max-width 400` |
| `--img-compress QUALITY` | 圖片壓縮品質 1-100（需要 sharp） | `--img-compress 80` |
| `--code-highlight enable\|disable` | 語法高亮（預設 enable） | `--code-highlight disable` |
| `--code-copy enable\|disable` | 程式碼複製按鈕（預設 enable） | `--code-copy disable` |
| `--code-highlight-theme NAME` | highlight.js 深色主題名稱 | `--code-highlight-theme github-dark` |
| `--code-highlight-theme-light NAME` | highlight.js 淺色主題名稱 | `--code-highlight-theme-light github` |

## 輸入模式

### A. 單一檔案

```bash
mdsone README.md
# 輸出：CWD/README.html（預設）

mdsone README.md -o dist/index.html
```

### B. 多檔合併（依輸入順序）

> 多檔模式下 `-o` 為**必填**。

```bash
mdsone intro.md guide.md reference.md -o manual.html
```

### C. 單一資料夾（檔名 A-Z 合併）

```bash
mdsone ./docs
# 輸出：CWD/docs.html（預設）

mdsone ./docs -o dist/manual.html
```

> 不支援「檔案與資料夾混合輸入」。

## 覆蓋保護 (`-f`)

| 旗標 | 行為 |
|------|------|
| ``-f true``（預設） | 直接覆蓋已存在的輸出檔 |
| ``-f false`` | 若目標檔已存在則中止並報錯 |

```bash
# 若 output.html 已存在則中止
npx mdsone README.md -o output.html -f false
```

## 設定方式（優先順序）

設定可透過以下三種方式指定，優先順序如下：

### 1. CLI 參數（最高優先）

```bash
npx mdsone ./docs -o ./dist/index.html --i18n-mode false
```

### 2. 環境變數

```bash
export MARKDOWN_SOURCE_DIR="./docs"
export OUTPUT_FILE="./dist/index.html"
export I18N_MODE="false"
npx mdsone
```

在 CI 環境（如 GitHub Actions）中特別重要：

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

### 3. config.toml（本地開發推薦）

```toml
[paths]
source = "./docs"         # 無 CLI inputs 時的 fallback 來源
output_file = "./dist/index.html"

[build]
default_template = "normal"
img_to_base64 = true
img_max_width = 600
img_compress = 90

[i18n]
mode = true
default_locale = "zh-TW"
```

```bash
npx mdsone
# 本地開發時也可以用
npm start
```

### 4. 預設值

若上述三種皆未設定，使用內建預設值。

## 參數與配置的對應

| 功能 | CLI | 環境變數 | config.toml |
| ---------------- | ----------------------------- | ---------------------------- | ------------------------------------ |
| Markdown 來源 | `<inputs...>` | `MARKDOWN_SOURCE_DIR` | `[paths] source` |
| 輸出路徑 | `-o, --output` | `OUTPUT_FILE` | `[paths] output_file` |
| 模板 | `--template` | `DEFAULT_TEMPLATE` | `[build] default_template` |
| 語系 | `--locale` | `LOCALE` | `[i18n] locale` |
| 多語言模式 | `--i18n-mode` | `I18N_MODE` | `[i18n] mode` |
| 預設語系 | `--default-locale` | `DEFAULT_LOCALE` | `[i18n] default_locale` |
| 頁面標題 | `--site-title` | `SITE_TITLE` | `[site] title` |
| 主題 | `--theme-mode` | `THEME_MODE` | `[site] theme_mode` |
| 壓縮 HTML | `--minify-html` | `MINIFY_HTML` | `[build] minify_html` |
| 建置日期 | 無 | `BUILD_DATE` | `[build] build_date` |
| 圖片 base64 嵌入 | `--img-to-base64` | `IMG_TO_BASE64` | `[build] img_to_base64` |
| 圖片最大寬度 | `--img-max-width` | `IMG_MAX_WIDTH` | `[build] img_max_width` |
| 圖片壓縮品質 | `--img-compress` | `IMG_COMPRESS` | `[build] img_compress` |
| 語法高亮 | `--code-highlight` | `CODE_HIGHLIGHT` | `[build] code_highlight` |
| 複製按鈕 | `--code-copy` | `CODE_COPY` | `[build] code_copy` |
| 高亮深色主題 | `--code-highlight-theme` | `CODE_HIGHLIGHT_THEME` | `[build] code_highlight_theme` |
| 高亮淺色主題 | `--code-highlight-theme-light` | `CODE_HIGHLIGHT_THEME_LIGHT` | `[build] code_highlight_theme_light` |

## 使用範例

```bash
# 單一檔案
npx mdsone README.md
npx mdsone README.md -o dist/index.html

# 多檔合併（依順序）
npx mdsone intro.md guide.md -o manual.html

# 資料夾模式
npx mdsone ./docs
npx mdsone ./docs -o dist/manual.html --template normal

# 多語言模式（資料夾來源）
npx mdsone ./docs --i18n-mode true --default-locale zh-TW

# 嵌入圖片為 base64（無 resize）
npx mdsone ./docs -o dist/index.html --img-to-base64 true

# 嵌入圖片並 resize + 壓縮（需要 sharp）
npx mdsone ./docs -o dist/index.html --img-to-base64 true --img-max-width 600 --img-compress 90

# 禁用語法高亮和複製按鈕
npx mdsone ./docs -o dist/index.html --code-highlight disable --code-copy disable

# 覆蓋保護
npx mdsone README.md -o output.html -f false
```