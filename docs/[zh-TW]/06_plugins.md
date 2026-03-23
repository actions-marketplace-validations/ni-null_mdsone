# Plugins

## image

用途：將 `<img src="...">` 轉為 base64 內嵌，支援本機與遠端圖片來源。

CLI：

```bash
npx mdsone README.md --img-embed=base64
npx mdsone README.md --img-embed=base64 --img-max-width 400 --img-compress 80
```

環境變數：

```env
IMG_EMBED=base64
IMG_MAX_WIDTH=400
IMG_COMPRESS=80
```

TOML：

```toml
[plugins.image]
embed = "off"      # off / base64
max_width = 0
compress = 0
```

## katex

用途：啟用 Markdown 數學公式渲染與 KaTeX 樣式注入。

CLI：

```bash
npx mdsone README.md --katex
npx mdsone README.md --katex=full
npx mdsone README.md --katex=off
```

環境變數：

```env
KATEX=on     # on / off / full
```

TOML：

```toml
[plugins.katex]
enable = true
mode = "woff2"     # woff2 / full
```

## code-highlight

用途：程式碼區塊語法高亮（預設啟用）。

CLI：

```bash
npx mdsone README.md --code-highlight=off
```

環境變數：

```env
CODE_HIGHLIGHT=off  # on / off
```

TOML：

```toml
[plugins."code-highlight"]
enable = true
```

## code-copy

用途：在程式碼區塊提供複製按鈕（整行或命令段落模式）。

CLI：

```bash
npx mdsone README.md --code-copy=off
npx mdsone README.md --code-copy=line
npx mdsone README.md --code-copy=cmd
```

環境變數：

```env
CODE_COPY=cmd       # off / line / cmd
```

TOML：

```toml
[plugins."code-copy"]
enable = true
mode = "off"       # off / line / cmd
```

## code-line-number

用途：在程式碼區塊顯示行號。

CLI：

```bash
npx mdsone README.md --code-line-number
npx mdsone README.md --code-line-number=off
```

環境變數：

```env
CODE_LINE_NUMBER=on # on / off
```

TOML：

```toml
[plugins."code-line-number"]
enable = false
```

## minify

用途：最終輸出 HTML 壓縮（含 inline CSS/JS）。

CLI：

```bash
npx mdsone README.md --minify
npx mdsone README.md --minify=off
```

環境變數：

```env
MINIFY=on           # on / off
```

TOML：

```toml
[plugins.minify]
enable = false
```
