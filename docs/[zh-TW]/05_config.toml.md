# config.toml 範例

以下是目前版本對應的 `config.toml` 範例。

```bash
# 使用目前目錄下的 config.toml
npx mdsone

# 指定 config.toml
npx mdsone --config ./config.toml

# 忽略 config.toml
npx mdsone --no-config
```

```toml
[paths]
source = "./docs"
output_file = "./dist/index.html"
templates_dir = "templates"

[build]
default_template = "normal"
template_type = "default"
minify_html = true
markdown_extensions = ["tables", "fenced_code", "nl2br", "sane_lists", "attr_list"]
build_date = ""

[site]
title = "Documentation"
theme_mode = "light"

[i18n]
locale = "en"
mode = false
default_locale = ""

[plugins]
order = ["image", "shiki", "copy", "line_number"]
copy = { enable = true, mode = "none", line_copy = false }
shiki = { enable = true }
line_number = { enable = false }
image = { base64_embed = false, max_width = 0, compress = 0 }
```

## 補充

- `highlight` 已移除，不再使用 `[plugins.highlight]`
- Shiki 主題名稱不再由 `config.toml` 控制，而是由模板自己的 `template.config.json` 定義
- `plugins.order` 只決定 plugin 執行順序，不會改變核心 Markdown 轉換流程
