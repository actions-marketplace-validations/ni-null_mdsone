# Plugins

目前內建四個 plugin：`image`、`shiki`、`copy`、`line_number`。

它們都在核心 Markdown 轉成 HTML 之後介入：

1. `processHtml()`：改寫 HTML
2. `getAssets()`：注入外掛需要的 CSS / JS

這代表核心不需要知道 Shiki 或圖片處理細節，只要交給 plugin manager 依順序處理即可。

## image

- 功能：把 HTML 中的 `<img src="...">` 轉成 base64 data URL
- 支援本地圖片與遠端 `http/https` 圖片
- 可搭配縮放與壓縮
- 啟用條件：`img_to_base64 = true`

```bash
npx mdsone README.md -o index.html --img-base64-embed
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400 --img-compress 80
```

對應設定：

- `[plugins.image].base64_embed`
- `[plugins.image].max_width`
- `[plugins.image].compress`

## shiki

- 功能：將一般 `<pre><code>` 區塊改寫成 Shiki 高亮 HTML
- 啟用條件：`code_highlight = true`
- 若 fenced code 沒指定語言，可依模板設定的 `auto_detect` 使用 `highlight.js` 自動判斷
- Shiki 主題由模板的 `template.config.json` 控制

對應設定：

- `[plugins.shiki].enable`

模板設定位置：

- `config.types.<name>.code.Shiki.dark`
- `config.types.<name>.code.Shiki.light`
- `config.types.<name>.code.Shiki.auto_detect`

## copy

- 功能：為程式碼區塊加入複製能力
- 啟用條件：`code_copy = true`
- 支援 `line` 與 `cmd` 兩種模式

```bash
# 啟用 copy plugin（但不指定特殊模式）
npx mdsone README.md -o index.html --code-copy true

# 單行命令複製
npx mdsone README.md -o index.html --code-copy line

# 依註解區塊複製命令段落
npx mdsone README.md -o index.html --code-copy cmd

# 等同於把 mode 切成 line
npx mdsone README.md -o index.html --line-copy
```

對應設定：

- `[plugins.copy].enable`
- `[plugins.copy].mode`
- `[plugins.copy].line_copy`

## line_number

- 功能：在程式碼區塊加入行號
- 啟用條件：`code_line_number = true`
- 若 code block 已被其他 plugin 包成 `.code-line`，會直接補上行號欄位

```bash
npx mdsone README.md -o index.html --code-line-number true
```

對應設定：

- `[plugins.line_number].enable`

## config.toml 範例

```toml
[plugins]
order = ["image", "shiki", "copy", "line_number"]
copy = { enable = true, mode = "none", line_copy = false }
shiki = { enable = true }
line_number = { enable = false }
image = { base64_embed = false, max_width = 0, compress = 0 }
```

## 執行順序

預設內建 plugin 註冊順序為：

1. `image`
2. `shiki`
3. `copy`
4. `line_number`

若有設定 `[plugins].order`，會依該順序執行。
