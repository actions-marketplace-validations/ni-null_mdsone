# Templates

## Built-in Templates

| Name      | Description |
| --------- | ----------- |
| `normal`  | Sidebar + TOC + theme toggle |
| `minimal` | Clean layout for lightweight docs |

```bash
npx mdsone --template normal
npx mdsone --template minimal
```

## Template Variant

Use `--template <theme-or-path>@<variant>` to select a variant defined by the template.
If the variant does not exist, mdsone falls back to `default`.
If `config.types.<variant>.palette` is omitted, mdsone uses the variant key as the palette name (`default` falls back to `config.palette`).

```bash
npx mdsone ./docs -m --template normal@default
npx mdsone ./docs -m --template normal@warm-cream
npx mdsone ./docs -m --template ./themes/dark-doc@ocean
```

## Code Highlighting (Shiki)

Code highlighting is handled by `plugins/shiki` during build.
Template defaults come from `template.config.json`.

```json
{
  "config": {
    "code": {
      "Shiki": {
        "dark": "github-dark",
        "light": "github-light",
        "auto_detect": true
      }
    },
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

## Template Structure

```text
templates/
  my-template/
    template.html
    style.css
    template.config.json
    assets/
      01-base.css
      10-interaction.js
```

## assets/ Folder

Files in `assets/` are auto-scanned and inline-injected:

- `.css` files are injected into `<head>` as `<style>`
- `.js` files are injected before `</body>` as `<script>`
- files are sorted by filename (numeric prefixes are recommended)

## template.html Placeholders

| Placeholder | Replaced With |
| ----------- | ------------- |
| `{TITLE}` | Page title |
| `{LANG}` | HTML lang attribute |
| `{CSS_CONTENT}` | `style.css` content |
| `{LIB_CSS}` | Plugin/library style bundle |
| `{EXTRA_CSS}` | `assets/` CSS inline tags |
| `{LIB_JS}` | Plugin/library script bundle |
| `{EXTRA_JS}` | `assets/` JS inline tags |
| `{MDSONE_DATA_SCRIPT}` | Document payload script |
