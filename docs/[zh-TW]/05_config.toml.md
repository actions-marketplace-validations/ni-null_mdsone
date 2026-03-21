# config.toml 範例

以下是目前版本對應的 `config.toml` 範例。

```bash
# 指定 config.toml
npx mdsone --config ./config.toml
```

```toml
[paths]
source = "./docs"
output_file = "./dist/index.html"
templates_dir = "templates"

[build]
default_template = "normal@warm-cream" # 格式：<theme-or-path>[@variant]
markdown_extensions = ["tables", "fenced_code", "nl2br", "sane_lists", "attr_list"]
build_date = ""

[site]
title = "Documentation"
theme_mode = "light"

[i18n]
mode = false
default_locale = "en"

[plugins]
order = ["image", "katex", "code-highlight", "code-copy", "code-line-number", "minify"]
"code-copy" = { enable = true, mode = "off" }
"code-highlight" = { enable = true }
katex = { enable = true, mode = "woff2" }
"code-line-number" = { enable = false }
image = { embed = "off", max_width = 0, compress = 0 }
minify = { enable = false } # 可搭配 CLI: --minify / --minify=off 覆蓋
```

## 補充

- Shiki 主題名稱不再由 `config.toml` 控制，而是由模板自己的 `template.config.json` 定義
- `plugins.order` 只決定 plugin 執行順序，不會改變核心 Markdown 轉換流程

- KaTeX 預設自動啟用；可用 [plugins.katex].enable = false 或 --katex=off 關閉。
- 啟用時僅在有公式渲染結果時注入 KaTeX CSS/字體。

