# 開發手冊（總覽）

本手冊對齊目前新版程式行為，並拆分為專門文件：

1. [01_範本](./01_範本.md)
2. [02_外掛](./02_外掛.md)

## 目前行為基準

- 設定優先序：`default < TOML < ENV < CLI`
- 模板主參數：`template`（CLI `--template`、TOML `[build].template`、ENV `TEMPLATE`）
- i18n 預設語系參數：`i18n_default_locale`（ENV `I18N_DEFAULT_LOCALE`）
- 外掛設定入口已改為規格映射：`src/plugins/option-specs.ts`

## 你現在該看哪份

- 需要做模板：看 `01_範本.md`
- 需要做外掛：看 `02_外掛.md`