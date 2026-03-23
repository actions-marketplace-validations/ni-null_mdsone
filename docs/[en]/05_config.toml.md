# config.toml

Use `config.toml` to manage stable project defaults.

```bash
npx mdsone --config ./config.toml
```

## Example

```toml
[paths]
source = "./docs"
output_file = "./dist/index.html"

[build]
template = "normal@warm-cream"  # <theme-or-path>[@variant]
build_date = ""

[site]
title = "Documentation"
theme_mode = "light"

[i18n]
mode = false
i18n_default_locale = ""

[markdown]
linkify = false
typographer = false
breaks = true
xhtml_out = false

[plugins]
"order" = ["image", "katex", "code-highlight", "code-copy", "code-line-number", "minify"]
"code-copy" = { enable = true, mode = "off" }
"code-highlight" = { enable = true }
"katex" = { enable = true, mode = "woff2" }
"code-line-number" = { enable = false }
"image" = { embed = "off", max_width = 0, compress = 0 }
"minify" = { enable = false }
```

## Notes

- No `.env` auto-loading. Runtime order is: CLI > ENV > TOML > defaults.
- Current `config.toml` keys supported by the program:
  - `[paths] source` (legacy alias: `[paths] markdown_source_dir`)
  - `[paths] output_file`
  - `[build] template`
  - `[build] build_date`
  - `[site] title`
  - `[site] theme_mode`
  - `[i18n] mode`
  - `[i18n] i18n_default_locale`
  - `[markdown] linkify` / `typographer` / `breaks` / `xhtml_out`
  - `[plugins] order` and plugin subtables
- `[i18n].locale` and `[i18n].default_locale` are removed. Use `[i18n].i18n_default_locale`.
- Core always enables `markdown-it-attrs`, `markdown-it-footnote`, and `markdown-it-task-lists`.
- `[markdown]` options map to markdown-it booleans (`linkify`, `typographer`, `breaks`, `xhtml_out`).
- CLI can override these with `--md-linkify`, `--md-typographer`, `--md-breaks`, `--md-xhtml-out` (`on/off`, bare flag = `on`).
- KaTeX is auto-enabled by default. Set `katex.enable = false` (or `--katex=off`) to disable completely.
- Even when enabled, KaTeX CSS/fonts are injected only when rendered formula markup exists.
- Shiki theme selection is controlled by template variant (`template.config.json`), not by `config.toml`.
- `plugins.order` controls plugin execution order. `minify` is still forced to run last for output-stage processing.
- `--template` supports `name@variant` and direct template folder path.
