// ============================================================
// src/core/types.ts ??????TypeScript 隞????// ?詨?撅日靘陷嚗?撘隞颱? Node.js / runtime API
// ============================================================

/** 摰閮剖??拐辣嚗???Python CONFIG dict嚗?*/
export interface Config {
  // paths
  markdown_source_dir: string;
  output_file: string;
  templates_dir: string;
  locales_dir: string;
  // build
  default_template: string;
  minify_html: boolean;
  markdown_extensions: string[];
  build_date: string;
  // site
  site_title: string;
  theme_mode: "light" | "dark" | string;
  // i18n
  locale: string;
  i18n_mode: boolean;
  default_locale: string;
  // advanced
  img_to_base64: boolean;
  img_max_width: number;
  img_compress: number;
  // code features
  code_highlight: boolean;
  code_copy: boolean;
  code_copy_mode: string;
  code_line_copy: boolean;
  code_line_number: boolean;
  template_type: string;
  // plugin settings (optional)
  plugins?: {
    order?: string[];
  };
}

/** CLI 撘?拐辣嚗ommander 閫??敺? */
export interface CliArgs {
  inputs?: string[];
  merge?: boolean;
  template?: string;
  locale?: string;
  output?: string;
  force?: string;
  siteTitle?: string;
  themeMode?: string;
  i18nMode?: boolean;
  defaultLocale?: string;
  minifyHtml?: string;
  templatesDir?: string;
  templateType?: string;
  configPath?: string;
  noConfig?: boolean;
  pluginOverrides?: Partial<Config>;
  version?: boolean;
}

/** locale JSON 瑼???瑽?en.json / zh-TW.json嚗?*/
export interface I18nFile {
  _comment?: string;
  _locale?: string;
  cli: Record<string, string>;
  /** template ?憛?勗?璅⊥??locales/ ??嚗??獢? */
  template?: Record<string, string>;
}

/** ?桐??辣?嚗???mdsone_DATA.docs[n]嚗?*/
export interface DocItem {
  id: string;
  title: string;
  name: string;
  html: string;
}

/** TOC 閮剖? */
export interface TocConfig {
  enabled: boolean;
  levels: number[];
}

/** Template config.json 銝?_metadata ?拐辣 */
export interface TemplateMetadata {
  name?: string;
  description?: string;
  version?: string;
  schema_version?: string;
  author?: string;
}

/** Template-level user-overridable config */
export interface TemplateRuntimeConfig {
  palette?: string;
  code?: {
    Shiki?: {
      dark?: string;
      light?: string;
      auto_detect?: boolean;
    };
  };
  types?: Record<string, {
    palette?: string;
    code?: {
      Shiki?: {
        dark?: string;
        light?: string;
        auto_detect?: boolean;
      };
    };
  }>;
}

/** template_loader 頛敺?摰璅⊥鞈?嚗撌脰???瑼??批捆嚗?*/
export interface TemplateData {
  /** style.css ???? */
  css: string;
  /** template.html ????嚗 {PLACEHOLDER}嚗?/
  template: string;
  /**
   * assets/ 鞈?憭曆葉靘摮?蝬湔?摨? CSS 瑼?皜嚗歇霈?亙摰對?
   * 撱箇蔭?誑 <style> inline 瘜典 {EXTRA_CSS}
   */
  assets_css: Array<{ filename: string; content: string }>;
  /**
   * assets/ 鞈?憭曆葉靘摮?蝬湔?摨? JS 瑼?皜嚗歇霈?亙摰對?
   * 撱箇蔭?誑 <script> inline 瘜典 {EXTRA_JS}
   */
  assets_js: Array<{ filename: string; content: string }>;
  version: string;
  schema_version: string;
  metadata: TemplateMetadata;
  toc_config: TocConfig;
  config: TemplateRuntimeConfig;
}

/** buildHtml() ?撓?亙???*/
export interface BuildParams {
  config: Config;
  /** ?株?璅∪?嚗 tab_name: html } */
  documents?: Record<string, string>;
  /** 憭?璅∪?嚗 locale: { tab_name: html } } */
  multiDocuments?: Record<string, Record<string, string>>;
  templateData: TemplateData;
  /** ?株? i18n 摮葡嚗???getAllTemplateStrings嚗?*/
  i18nStrings?: Record<string, string>;
  /** 憭? i18n 摮葡 { locale: { key: val } } */
  multiI18nStrings?: Record<string, Record<string, string>>;
  /** 全域語言顯示名稱對照（來源：locales/config.json） */
  localeNames?: Record<string, string>;
  /** 敺?lib/ 蝯??見撘?蝐歹?? {LIB_CSS}嚗?*/
  libCss?: string;
  /** 敺?lib/ 蝯???祆?蝐歹?? {LIB_JS}嚗?*/
  libJs?: string;
}

/** validateConfig() ???喳???*/
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ?? mdsone_DATA 蝯?嚗釣?亥 HTML ??JSON payload嚗??

/** ?株?璅∪???mdsone_DATA */
export interface mdsoneDataSingle {
  docs: DocItem[];
  config: mdsoneConfigPayload;
  i18n: Record<string, string>;
  localeNames?: Record<string, string>;
}

/** 憭?璅∪???mdsone_DATA */
export interface mdsoneDataMulti {
  locales: string[];
  defaultLocale: string;
  docs: Record<string, DocItem[]>;
  config: mdsoneConfigPayload;
  i18n: Record<string, Record<string, string>>;
  localeNames?: Record<string, string>;
}

export type mdsoneData = mdsoneDataSingle | mdsoneDataMulti;

/** mdsone_DATA.config 畾菔 */
export interface mdsoneConfigPayload {
  site_title: string;
  theme_mode: string;
  build_date: string;
  toc: TocConfig;
  template_type?: string;
  palette?: string;
  types?: Record<string, { palette?: string }>;
}

// ?? Plugin 蝟餌絞 ??????????????????????????????????????????????

/** Plugin getAssets() ???喳??伐?css/js ?箏璅惜????HTML 摮葡 */
export interface PluginAssets {
  /** 摰 HTML嚗 <style> 璅惜嚗?憒?<style id="...">...</style>嚗?*/
  css?: string;
  /** 摰 HTML嚗 <script> 璅惜嚗?憒?<script>...</script>嚗?*/
  js?: string;
}

/** Plugin processHtml() ?嗅?銵?銝? */
export interface PluginContext {
  /** ?嗅?????Markdown 瑼???函???冽閫???砍???詨?頝臬?嚗?*/
  sourceDir: string;
  templateData?: TemplateData;
}

/** CLI program 隞嚗??core ?湔靘陷 commander嚗?*/
export interface CliProgram {
  option: (...args: unknown[]) => unknown;
}

/** Plugin 隞嚗???plugin 敹?撖虫? name ??isEnabled */
export interface Plugin {
  /** plugin ?迂嚗銝霅嚗?潭隤? */
  readonly name: string;

  /**
   * 閮餃? CLI ?嚗?賂?
   */
  registerCli?: (program: CliProgram) => void;

  /**
   * 撠?CLI ?頧 config 閬?嚗?賂?
   */
  cliToConfig?: (opts: Record<string, unknown>, out: Partial<Config>) => void;

  /**
   * ?斗甇?plugin ?函策摰?config 銝?血??具?   * ??plugin ?芾?摰???璇辣嚗anager 銝??仿?蝝啁???   */
  isEnabled: (config: Config) => boolean;

  /**
   * HTML 敺???畾蛛??舫嚗?   * ??markdownToHtml() 銋??uildHtml() 銋??瑁???   * @returns ??敺? HTML 摮葡
   */
  processHtml?: (
    html: string,
    config: Config,
    context: PluginContext,
  ) => string | Promise<string>;

  /**
   * ???瘜典頛詨 HTML ????皞??舫嚗?   * ???css/js ?摰??<style>/<script> 璅惜??   */
  getAssets?: (config: Config) => PluginAssets | Promise<PluginAssets>;

  /**
   * 撽? config ???改??舫嚗?   * @returns ?航炊閮???嚗征???銵函內撽???
   */
  validateConfig?: (config: Config) => string[];
}




