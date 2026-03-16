// ============================================================
// plugins/copy/index.ts — 複製按鈕 Plugin
// ============================================================

import type { Plugin, PluginAssets } from "../../src/core/types.js";
import { getCopyButtonScript, getLineCopyStyle, getCmdCopyStyle } from "./copy-button.js";

export const copyPlugin: Plugin = {
    name: "copy",

    registerCli(program) {
        program.option(
            "--code-copy [mode]",
            "Copy button mode: true/false or line/cmd (default: true)",
        );
        program.option("--line-copy", "Enable per-line copy button on code blocks");
    },

    cliToConfig(opts, out) {
        const raw = opts["codeCopy"];

        // --code-copy 不帶值代表 true
        if (raw === true || raw === undefined) {
            if (opts["lineCopy"] === true) {
                out.code_copy = true;
                out.code_copy_mode = "line";
            }
            return;
        }

        const v = String(raw).toLowerCase();
        if (v === "false") {
            out.code_copy      = false;
            out.code_copy_mode = "none";
        } else if (v === "line") {
            out.code_copy      = true;
            out.code_copy_mode = "line";
        } else if (v === "cmd") {
            out.code_copy      = true;
            out.code_copy_mode = "cmd";
        }
    },

    isEnabled: (config) => config.code_copy !== false,

    getAssets(config): PluginAssets {
        const script   = getCopyButtonScript();
        const mode     = (config.code_copy_mode ?? (config.code_line_copy ? "line" : "none")) as string;
        const blockOn  = config.code_copy !== false;

        // initCall
        const calls: string[] = [];
        if (blockOn)        calls.push("window.__mdsone_copy(root)");
        if (mode === "line") calls.push("window.__mdsone_line_copy(root)");
        if (mode === "cmd")  calls.push("window.__mdsone_cmd_copy(root)");
        const initCall = calls.join("; ");

        // CSS
        let css: string | undefined;
        if (mode === "line") css = `<style id="mdsone-line-copy">\n${getLineCopyStyle()}\n</style>`;
        if (mode === "cmd")  css = `<style id="mdsone-cmd-copy">\n${getCmdCopyStyle()}\n</style>`;

        return {
            css,
            js:
                `<script>\n` +
                `try {\n` +
                script + `\n` +
                `var __mdsone_copy_apply = function (root) { ${initCall} };\n` +
                `if (document.readyState === 'loading') {\n` +
                `  document.addEventListener('DOMContentLoaded', function () { __mdsone_copy_apply(document.body); });\n` +
                `} else {\n` +
                `  __mdsone_copy_apply(document.body);\n` +
                `}\n` +
                `if (typeof MutationObserver !== 'undefined') {\n` +
                `  var obs = new MutationObserver(function (mutations) {\n` +
                `    mutations.forEach(function (m) {\n` +
                `      m.addedNodes && m.addedNodes.forEach(function (n) {\n` +
                `        if (n && n.nodeType === 1) __mdsone_copy_apply(n);\n` +
                `      });\n` +
                `    });\n` +
                `  });\n` +
                `  obs.observe(document.body, { childList: true, subtree: true });\n` +
                `}\n` +
                `} catch(e) {\n` +
                `  console.warn('[mdsone] Failed to load copy button:', e.message);\n` +
                `}\n` +
                `</script>`,
        };
    },
};
