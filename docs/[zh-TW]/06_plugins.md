# Plugins

目前內建 plugin：

- `image`
- `katex`
- `code-highlight`
- `code-copy`
- `code-line-number`
- `minify`

Plugin 生命週期分成四個可介入階段，流程如下：

1. `PluginManager.extendMarkdown()`：在 Markdown render 前擴充 markdown-it
2. `PluginManager.processHtml()`：在文件片段 HTML 上做 DOM 後處理
3. `PluginManager.getAssets()`：收集 plugin 的 CSS / JS 資源
4. `PluginManager.processOutputHtml()`：在 `buildHtml()` 後處理完整頁面（`minify` 固定最後執行）

## image

用途：

- 掃描 HTML 內 `<img src="...">`
- 將本機或遠端圖片轉為 base64 data URL
- 已經是 `data:` 的圖片會略過

CLI：

```bash
npx mdsone README.md -o index.html --img-embed=base64
npx mdsone README.md -o index.html --img-embed=base64 --img-max-width 400
npx mdsone README.md -o index.html --img-embed=base64 --img-max-width 400 --img-compress 80
```

TOML：

- `[plugins.image].embed`（`off` 或 `base64`）
- `[plugins.image].max_width`
- `[plugins.image].compress`

## code-highlight

用途：

- 在 Markdown 前置階段接管 fenced code 渲染，輸出 Shiki 高亮結果
- 高亮能力由 plugin 注入，核心不直接耦合 Shiki

CLI：

```bash
npx mdsone README.md -o index.html --code-highlight=off
```

TOML：

- `[plugins."code-highlight"].enable`

模板設定（`template.config.json`）：

- `config.types.<name>.code.Shiki.dark`
- `config.types.<name>.code.Shiki.light`
- `config.types.<name>.code.Shiki.auto_detect`

說明：

- fenced code 有指定語言時直接使用該語言
- 未指定語言時，若 `auto_detect=true`，會用 `highlight.js` 自動判斷語言再交給 Shiki

## code-copy

用途：

- 在程式碼區塊提供複製功能
- 支援一般區塊複製，以及額外的逐行 / 指令段落複製模式

CLI：

```bash
# 關閉複製
npx mdsone README.md -o index.html --code-copy=off

# 逐行指令複製
npx mdsone README.md -o index.html --code-copy=line

# 指令段落複製（以註解區塊分段）
npx mdsone README.md -o index.html --code-copy=cmd
```

TOML：

- `[plugins."code-copy"].enable`
- `[plugins."code-copy"].mode`（`off` / `line` / `cmd`）

## code-line-number

用途：

- 在程式碼區塊加上行號
- 若 copy plugin 已先包裝 `.code-line`，會在原結構上補行號，不重複包裝

CLI：

```bash
npx mdsone README.md -o index.html --code-line-number
npx mdsone README.md -o index.html --code-line-number=off
```

TOML：

- `[plugins."code-line-number"].enable`

## config.toml 範例

```toml
[plugins]
order = ["image", "katex", "code-highlight", "code-copy", "code-line-number", "minify"]
"code-copy" = { enable = true, mode = "off" }
"code-highlight" = { enable = true }
katex = { enable = true, mode = "woff2" }
"code-line-number" = { enable = false }
image = { embed = "off", max_width = 0, compress = 0 }
minify = { enable = false }
```

## 執行順序

預設順序：

1. `image`
2. `katex`
3. `code-highlight`
4. `code-copy`
5. `code-line-number`
6. `minify`

可用 `[plugins].order` 自訂順序；未列出的 plugin 會排在後面。  
`minify` 即使被排在前面，仍會在完整頁面後處理階段固定最後執行。

## katex

用途：

1. 在 Markdown 前置階段註冊 `markdown-it-katex`。
2. 在輸出階段檢查是否存在 KaTeX 渲染結果（`.katex` / `.katex-display`）。
3. 只有偵測到公式渲染結果時，才注入 KaTeX CSS/字體。

CLI：

```bash
npx mdsone README.md -o index.html --katex
npx mdsone README.md -o index.html --katex=full
npx mdsone README.md -o index.html --katex=off
```

TOML：

```toml
[plugins.katex]
enable = true
mode = "woff2" # 可改為 "full"
```

備註：

- 預設為自動啟用（除非 `enable = false` 或使用 `--katex=off`）。
- `mode = "full"` 會內嵌完整字體，輸出檔案較大。
- 即使啟用，沒有公式時也不會注入 KaTeX CSS/字體。

## minify

用途：

- 在完整頁面 HTML 輸出前做壓縮（包含 HTML、inline CSS、inline JS）
- 僅作用於 `processOutputHtml()` 階段，不影響單一片段 HTML

CLI：

```bash
npx mdsone README.md -o index.html --minify
npx mdsone README.md -o index.html --minify=off
```

TOML：

```toml
[plugins.minify]
enable = false
```

