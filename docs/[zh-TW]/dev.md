# 開發說明

本文件整理給開發者使用的說明，包含模板結構、模板配置與 plugin 介入點。

## 模板結構

```text
templates/
└── my-template/
    ├── template.html
    ├── style.css
    ├── template.config.json
    ├── locales/
    │   ├── en.json
    │   └── zh-TW.json
    └── assets/
        ├── 01_base.css
        └── 02_behavior.js
```

## assets/

`assets/` 內的 CSS / JS 檔案會自動掃描並 inline 注入：

- CSS 注入為 `<style>`，放在 `<head>`
- JS 注入為 `<script>`，放在 `</body>` 前
- 檔名會依字典序排序，建議用數字前綴控制順序

## template.config.json

目前模板設定集中在 `config` 區塊：

```json
{
  "_metadata": {
    "version": "1.1.0",
    "schema_version": "v1"
  },
  "config": {
    "palette": "fog-gray",
    "types": {
      "default": {
        "code": {
          "Shiki": {
            "dark": "github-dark",
            "light": "github-light",
            "auto_detect": true
          }
        }
      }
    }
  }
}
```

| 欄位 | 說明 |
|------|------|
| `_metadata.version` | 模板版本 |
| `_metadata.schema_version` | 模板配置格式版本 |
| `config.palette` | 預設配色名稱 |
| `config.types` | 模板變體定義 |
| `config.types.<name>.palette` | 可選。未設定時會使用變體鍵名作為配色（`default` 仍回退到 `config.palette`） |
| `config.types.<name>.code.Shiki.*` | 該變體的程式碼高亮主題設定 |

TOC 目前由模板腳本控制，不透過 `template.config.json` 動態配置。

## 新增自訂模板

```bash
# Windows PowerShell
Copy-Item -Recurse templates/normal templates/my-template

# macOS / Linux
cp -r templates/normal templates/my-template

# 使用自訂模板
npx mdsone ./docs -m --template my-template
```

## template.html 佔位符

| 佔位符 | 替換內容 |
|--------|----------|
| `{TITLE}` | 頁面標題 |
| `{LANG}` | HTML `lang` 屬性 |
| `{CSS_CONTENT}` | `style.css` 內容 |
| `{LIB_CSS}` | plugin 提供的 CSS |
| `{EXTRA_CSS}` | `assets/` 內額外 CSS |
| `{LIB_JS}` | plugin 提供的 JS |
| `{EXTRA_JS}` | `assets/` 內額外 JS |
| `{MDSONE_DATA_SCRIPT}` | JSON 資料腳本（`<script id="mdsone-data" type="application/json">`） |

## 語系設計

- 全域語言顯示名稱：`locales/config.json`
- 全域 CLI / 共用字串：`locales/*.json`
- 模板專屬字串：`templates/<name>/locales/*.json`

## Plugin 架構

目前 plugin 採分階段介入，不是全部都在 Markdown 轉換後才執行。

流程大致如下：

1. `PluginManager.extendMarkdown()`：在 markdown-it render 前擴充語法（例如 KaTeX / 高亮前置）
2. 核心將 Markdown 轉成文件片段 HTML
3. `PluginManager.processHtml()`：依順序做 DOM 後處理（例如圖片嵌入、copy/行號）
4. `PluginManager.getAssets()`：收集 plugin 所需 CSS / JS
5. 模板注入 `{LIB_CSS}`、`{LIB_JS}` 並組裝完整頁面
6. `PluginManager.processOutputHtml()`：對完整頁面做最後後處理（例如 minify）

這種架構的好處是：

- 核心不需要知道 Shiki、KaTeX、圖片嵌入、copy button 的內部細節
- plugin 可依階段拆分責任（markdown 擴充 / DOM 改寫 / 最終輸出後處理）
- 模板只關心呈現與佔位符注入，不直接耦合 plugin 實作
