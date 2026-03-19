// ============================================================
// src/core/index.ts — Core 公開 API 匯出
// ============================================================

// Types
export type {
  Config,
  CliArgs,
  I18nFile,
  DocItem,
  TemplateMetadata,
  TemplateData,
  BuildParams,
  ValidationResult,
  mdsoneData,
  mdsoneDataSingle,
  mdsoneDataMulti,
  mdsoneConfigPayload,
} from "./types.js";

// Config
export { DEFAULT_CONFIG, mergeConfigs, cliArgsToConfig } from "./config.js";

// Markdown
export {
  escapeCodeBlocks,
  sanitizeTableCells,
  markdownToHtml,
  LOCALE_DIR_PATTERN,
} from "./markdown.js";

// i18n
export {
  getAllTemplateStrings,
  getAllLocalesTemplateStrings,
} from "./i18n.js";

// Template
export {
  generateExtraCssTags,
  generateExtraJsTags,
  assembleTemplate,
  buildExtraTags,
} from "./template.js";

// Builder
export {
  generateDataScript,
  buildHtml,
} from "./builder.js";

// Validator
export { validateConfig } from "./validator.js";
