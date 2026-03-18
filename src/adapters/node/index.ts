// ============================================================
// src/adapters/node/index.ts — Node Adapter 公開 API 匯出
// 供外部消費者使用：import { ... } from 'mdsone/node'
// ============================================================

// Config loader
export {
  envToConfig,
  loadConfigFile,
  buildConfig,
  validateDirExists,
} from "./config_loader.js";

// Filesystem
export {
  readTextFile,
  writeTextFile,
  ensureDir,
  dirExists,
  scanMarkdownFiles,
  scanLocaleSubDirs,
  scanTemplates,
  loadLocaleFile,
  loadLocaleNamesConfig,
  loadTemplateLocaleFile,
  loadTemplateFiles,
} from "./fs.js";

// Folder picker
export {
  pickDirectory,
  promptMissingPaths,
} from "./folder_picker.js";
