# Plugins

?桀??批遣??plugin嚗image`?shiki`?copy`?line_number`??
摰?冽敹?Markdown 頧? HTML 銋?隞嚗?
1. `processHtml()`嚗撖?HTML
2. `getAssets()`嚗釣?亙???閬? CSS / JS

?誨銵冽敹??閬??Shiki ?????敦蝭嚗閬漱蝯?plugin manager 靘?摨???胯?
## image

- ?嚗? HTML 銝剔? `<img src="...">` 頧? base64 data URL
- ?舀?砍????蝡?`http/https` ??
- ?舀?葬?曇?憯葬
- ?璇辣嚗img_to_base64 = true`

```bash
npx mdsone README.md -o index.html --img-base64-embed
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400
npx mdsone README.md -o index.html --img-base64-embed --img-max-width 400 --img-compress 80
```

撠?閮剖?嚗?
- `[plugins.image].base64_embed`
- `[plugins.image].max_width`
- `[plugins.image].compress`

## shiki

- ?嚗?銝??`<pre><code>` ?憛撖急? Shiki 擃漁 HTML
- ?璇辣嚗code_highlight = true`
- ??fenced code 瘝?摰?閮嚗靘芋?輯身摰? `auto_detect` 雿輻 `highlight.js` ?芸??斗
- Shiki 銝駁??望芋?輻? `template.config.json` ?批

撠?閮剖?嚗?
- `[plugins.shiki].enable`

璅⊥閮剖?雿蔭嚗?
- `config.types.<name>.code.Shiki.dark`
- `config.types.<name>.code.Shiki.light`
- `config.types.<name>.code.Shiki.auto_detect`

## copy

- ?嚗蝔?蝣澆?憛??亥?鋆質??- ?璇辣嚗code_copy = true`
- ?舀 `line` ??`cmd` ?拍車璅∪?

```bash
# ? copy plugin嚗?銝?摰畾芋撘?
npx mdsone README.md -o index.html --code-copy true

# ?株??賭誘銴ˊ
npx mdsone README.md -o index.html --code-copy line

# 區塊命令分段複製
npx mdsone README.md -o index.html --code-copy cmd

```

撠?閮剖?嚗?
- `[plugins.copy].enable`
- `[plugins.copy].mode`

## line_number

- ?嚗蝔?蝣澆?憛??亥???- ?璇辣嚗code_line_number = true`
- ??code block 撌脰◤?嗡? plugin ?? `.code-line`嚗??湔鋆?銵?甈?

```bash
npx mdsone README.md -o index.html --code-line-number true
```

撠?閮剖?嚗?
- `[plugins.line_number].enable`

## config.toml 蝭?

```toml
[plugins]
order = ["image", "shiki", "copy", "line_number"]
copy = { enable = true, mode = "none" }
shiki = { enable = true }
line_number = { enable = false }
image = { base64_embed = false, max_width = 0, compress = 0 }
```

## ?瑁???

?身?批遣 plugin 閮餃????綽?

1. `image`
2. `shiki`
3. `copy`
4. `line_number`

?交?閮剖? `[plugins].order`嚗?靘府???瑁???
