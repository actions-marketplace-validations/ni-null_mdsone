# config.toml

使用 `config.toml` 統一管理預設設定：

```bash
npx mdsone --config ./config.toml
```

## 範例

```toml
[paths]
source = "./docs"
output_file = "./dist/index.html"

[build]
template = "normal@warm-cream"
build_date = ""

[site]
title = "Documentation"
theme_mode = "light"

[i18n]
mode = false
i18n_default_locale = "en"

[markdown]
linkify = false
typographer = false
breaks = true
xhtml_out = false

[plugins]
order = ["image", "katex", "code-highlight", "code-copy", "code-line-number", "minify"]
"image" = { embed = "off", max_width = 0, compress = 0 }
"katex" = { enable = true, mode = "woff2" }
"code-highlight" = { enable = true }
"code-copy" = { enable = true, mode = "off" }
"code-line-number" = { enable = false }
"minify" = { enable = false }
```

## 欄位說明

| 區段 | 欄位 | 說明 |
| --- | --- | --- |
| `[paths]` | `source` | Markdown 輸入來源 |
| `[paths]` | `output_file` | 輸出 HTML 路徑 |
| `[build]` | `template` | 模板名稱、`name@variant` 或模板路徑 |
| `[build]` | `build_date` | 版本日期字串 |
| `[site]` | `title` | 網站標題 |
| `[site]` | `theme_mode` | 主題模式（例如 `light` / `dark`） |
| `[i18n]` | `mode` | 是否啟用多國語言 |
| `[i18n]` | `i18n_default_locale` | 預設語系 |
| `[markdown]` | `linkify` | Markdown linkify |
| `[markdown]` | `typographer` | Markdown typographer |
| `[markdown]` | `breaks` | Markdown breaks |
| `[markdown]` | `xhtml_out` | Markdown xhtml_out |
| `[plugins]` | `order` | 外掛執行順序 |

## 注意事項

- 優先序：`CLI > ENV > config.toml > 預設值`。
- `template` 與 CLI `--template` 對齊；不需要額外模板目錄欄位。
- `markdown_extensions` 不作為設定欄位，Markdown 擴充由核心與外掛流程控制。
