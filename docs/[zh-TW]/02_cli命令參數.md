# CLI 命令參數

## 語法

```bash
mdsone <inputs...> [-m] [-o output_path] [-f <boolean>] [options]
```

## 參數一覽

| 參數 / 選項 | 說明 | 範例 |
|------------|------|------|
| `<inputs...>` | 輸入來源：單一檔、多個檔、或單一資料夾 | `README.md`、`a.md b.md`、`./docs` |
| `-m, --merge` | 合併所有輸入為單一 HTML | `-m` |
| `-o, --output PATH` | 輸出路徑；合併模式為檔案，批次模式多檔 / 資料夾為目錄 | `-o dist/index.html` |
| `-f, --force <boolean>` | 是否覆蓋既有輸出（預設 `true`） | `-f false` |
| `--templates-dir <DIR>` | 模板目錄 | `--templates-dir ./templates` |
| `--template <NAME>` | 模板名稱（目前內建為 `normal`） | `--template normal` |
| `--template-type <NAME>` | 模板變體名稱；不存在時回退 `default` | `--template-type warm-cream` |
| `--site-title <TEXT>` | 文件標題 | `--site-title "My Docs"` |
| `--theme-mode <light\|dark>` | 初始明暗模式 | `--theme-mode dark` |
| `--minify-html <true\|false>` | 是否壓縮 HTML（預設 `true`） | `--minify-html false` |
| `--locale <CODE>` | 單語模式 UI 語系 | `--locale zh-TW` |
| `--i18n-mode` | 啟用多國語言模式 | `--i18n-mode` |
| `--i18n-default <CODE>` | 多國語言模式的預設語系 | `--i18n-default zh-TW` |
| `--config <PATH>` | 指定 `config.toml` 路徑 | `--config ./config.toml` |
| `--no-config` | 忽略 `config.toml` | `--no-config` |
| `--img-base64-embed [true\|false]` | 將圖片嵌入為 base64 | `--img-base64-embed` |
| `--img-max-width <pixels>` | 圖片最大寬度 | `--img-max-width 400` |
| `--img-compress <1-100>` | 圖片壓縮品質 | `--img-compress 80` |
| `--code-highlight <true\|false>` | 啟用 / 關閉語法高亮 | `--code-highlight false` |
| `--code-copy [mode]` | 程式碼複製模式：`true`、`false`、`line`、`cmd` | `--code-copy cmd` |
| `--code-line-number [true\|false]` | 顯示程式碼行號 | `--code-line-number true` |

## 輸入模式

### 批次模式（預設，不加 `-m`）

每個 Markdown 檔案各自輸出一個 HTML。

| 輸入 | 輸出 | `-o` 用途 |
|------|------|-----------|
| 單一檔案 | 單一 HTML | 可選；為輸出檔案路徑 |
| 多個檔案 | 多個 HTML | 可選；為輸出目錄 |
| 單一資料夾 | 多個 HTML | 必填；必須是輸出目錄 |

```bash
npx mdsone README.md
npx mdsone README.md -o dist/index.html
npx mdsone a.md b.md
npx mdsone a.md b.md -o ./dist
npx mdsone ./docs -o ./dist
```

### 合併模式（`-m`）

所有輸入會合併成單一 HTML，以 tab 方式呈現。

| 輸入 | 預設輸出 | `-o` 用途 |
|------|----------|-----------|
| 單一檔案 | `<name>.html` | 可選；為輸出檔案 |
| 多個檔案 | `merge.html` | 可選；為輸出檔案 |
| 單一資料夾 | `<dirname>.html` | 可選；為輸出檔案 |

```bash
npx mdsone intro.md guide.md -m
npx mdsone intro.md guide.md -m -o manual.html
npx mdsone ./docs -m
npx mdsone ./docs -m -o dist/manual.html
```

## 覆蓋保護

| 旗標 | 行為 |
|------|------|
| `-f true` | 直接覆蓋輸出 |
| `-f false`（合併模式） | 目標已存在時中止 |
| `-f false`（批次模式） | 已存在檔案會跳過，其餘繼續 |

## 設定優先順序

```text
CLI 參數 > 環境變數 > config.toml > 預設值
```

## 對應關係

| 功能 | CLI | 環境變數 | config.toml |
|------|-----|----------|-------------|
| Markdown 來源 | `<inputs...>` | `MARKDOWN_SOURCE_DIR` | `[paths] source` |
| 輸出路徑 | `-o, --output` | `OUTPUT_FILE` | `[paths] output_file` |
| 模板目錄 | `--templates-dir` | `TEMPLATES_DIR` | `[paths] templates_dir` |
| 模板 | `--template` | `DEFAULT_TEMPLATE` | `[build] default_template` |
| 模板變體 | `--template-type` | `TEMPLATE_TYPE` | `[build] template_type` |
| 文件標題 | `--site-title` | `SITE_TITLE` | `[site] title` |
| 明暗模式 | `--theme-mode` | `THEME_MODE` | `[site] theme_mode` |
| 壓縮 HTML | `--minify-html` | `MINIFY_HTML` | `[build] minify_html` |
| 建置日期 | — | `BUILD_DATE` | `[build] build_date` |
| Markdown 擴充 | — | `MARKDOWN_EXTENSIONS` | `[build] markdown_extensions` |
| 單語 UI 語系 | `--locale` | `LOCALE` | `[i18n] locale` |
| 多語模式 | `--i18n-mode` | `I18N_MODE` | `[i18n] mode` |
| 多語預設語系 | `--i18n-default` | `DEFAULT_LOCALE` | `[i18n] default_locale` |
| 圖片 base64 嵌入 | `--img-base64-embed` | `IMG_TO_BASE64` | `[plugins.image] base64_embed` |
| 圖片最大寬度 | `--img-max-width` | `IMG_MAX_WIDTH` | `[plugins.image] max_width` |
| 圖片壓縮品質 | `--img-compress` | `IMG_COMPRESS` | `[plugins.image] compress` |
| 語法高亮 | `--code-highlight` | `CODE_HIGHLIGHT` | `[plugins.shiki] enable` |
| 程式碼複製 | `--code-copy` | `CODE_COPY` | `[plugins.copy] enable` |
| 程式碼行號 | `--code-line-number` | `CODE_LINE_NUMBER` | `[plugins.line_number] enable` |

## 使用範例

```bash
# 合併資料夾
npx mdsone ./docs -m

# 套用模板變體
npx mdsone ./docs -m --template normal --template-type warm-cream

# 多國語言
npx mdsone ./docs --i18n-mode --i18n-default zh-TW -o dist/index.html

# 圖片嵌入 + 壓縮
npx mdsone ./docs -m --img-base64-embed --img-max-width 600 --img-compress 90

# 關閉高亮與複製
npx mdsone ./docs -m --code-highlight false --code-copy false

# 顯示行號
npx mdsone ./docs -m --code-line-number true
```
