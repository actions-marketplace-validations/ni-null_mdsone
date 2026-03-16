# Plugin

此專案內建三個 plugin：`copy`、`highlight`、`image`。

## 參數與說明

### copy

- 功能：程式碼複製按鈕（含模式）
- 設定來源：`[plugins.copy].enable`
- 相關參數：`[plugins.copy].mode`（`none` / `line` / `cmd`）、`[plugins.copy].line_copy`

```bash
# 一般複製按鈕（預設）
npx mdsone README.md -o index.html --code-copy true

# 單行複製模式
npx mdsone README.md -o index.html --code-copy line

# 區段複製模式（# 註解作為區段標題）
npx mdsone README.md -o index.html --code-copy cmd

# 保留舊旗標（等同 line）
npx mdsone README.md -o index.html --line-copy
```

### highlight

- 功能：語法高亮與前端主題切換
- 設定來源：`[plugins.highlight].enable`
- 相關參數：`[plugins.highlight].theme`、`[plugins.highlight].theme_light`

### image

- 功能：將 `<img>` 轉換為 base64 data URL（支援本地與遠端）
- 設定來源：`[plugins.image].base64_embed`
- 相關參數：`[plugins.image].max_width`、`[plugins.image].compress`

```bash
# 嵌入圖片為 base64
npx mdsone README.md -o index.html --img-base64-embed

# 嵌入圖片並指定最大寬度
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400

# 嵌入圖片並壓縮（需要 sharp）
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400 --img-compress 80
```

## config.toml 範例

```toml
[plugins]
order = ["image", "highlight", "copy"]
copy = { enable = true, mode = "none", line_copy = false }
highlight = { enable = true, theme = "atom-one-dark", theme_light = "atom-one-light" }
image = { base64_embed = false, max_width = 0, compress = 0 }
```
