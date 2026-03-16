// ============================================================
// src/plugins/manager.ts — Plugin 管理器
// 負責按順序執行各 plugin，收集 HTML 資源統一注入
// ============================================================

import type { Config, Plugin, PluginContext } from "../core/types.js";
import { builtInPlugins } from "./index.js";

/**
 * 排序 plugin（若 config.plugins.order 有指定）。
 * 未指定或不存在的 plugin 維持原始順序。
 */
function sortPlugins(plugins: Plugin[], order: string[] | undefined): Plugin[] {
    if (!order || order.length === 0) return plugins;
    const priority = new Map(order.map((name, i) => [name, i]));
    return [...plugins].sort((a, b) => {
        const pa = priority.has(a.name) ? priority.get(a.name)! : Number.POSITIVE_INFINITY;
        const pb = priority.has(b.name) ? priority.get(b.name)! : Number.POSITIVE_INFINITY;
        if (pa === pb) return 0;
        return pa - pb;
    });
}

export class PluginManager {
    private readonly plugins: readonly Plugin[];

    constructor(plugins?: Plugin[]) {
        this.plugins = plugins ?? builtInPlugins;
    }

    /**
     * 按順序執行所有啟用 plugin 的 processHtml()。
     * 單一 plugin 失敗只印 WARN，不中止其餘處理。
     */
    async processHtml(
        html: string,
        config: Config,
        context: PluginContext,
    ): Promise<string> {
        let result = html;
        const ordered = sortPlugins(
            [...this.plugins],
            (config as unknown as { plugins?: { order?: string[] } }).plugins?.order,
        );
        for (const plugin of ordered) {
            if (plugin.isEnabled(config) && plugin.processHtml) {
                try {
                    result = await plugin.processHtml(result, config, context);
                } catch (e) {
                    console.warn(
                        `[WARN] Plugin "${plugin.name}" processHtml failed: ${e instanceof Error ? e.message : e}`,
                    );
                }
            }
        }
        return result;
    }

    /**
     * 收集所有啟用 plugin 的靜態資源，合併為 { css, js }。
     * 單一 plugin 失敗只印 WARN，不中止其餘收集。
     */
    async getAssets(config: Config): Promise<{ css: string; js: string }> {
        const cssParts: string[] = [];
        const jsParts: string[] = [];

        const ordered = sortPlugins(
            [...this.plugins],
            (config as unknown as { plugins?: { order?: string[] } }).plugins?.order,
        );
        for (const plugin of ordered) {
            if (plugin.isEnabled(config) && plugin.getAssets) {
                try {
                    const assets = await plugin.getAssets(config);
                    if (assets.css) cssParts.push(assets.css);
                    if (assets.js) jsParts.push(assets.js);
                } catch (e) {
                    console.warn(
                        `[WARN] Plugin "${plugin.name}" getAssets failed: ${e instanceof Error ? e.message : e}`,
                    );
                }
            }
        }

        return {
            css: cssParts.join("\n"),
            js: jsParts.join("\n"),
        };
    }

    /**
     * 執行所有啟用 plugin 的 validateConfig()，收集所有錯誤。
     */
    validateConfig(config: Config): string[] {
        return this.plugins
            .filter((p) => p.isEnabled(config) && p.validateConfig)
            .flatMap((p) => p.validateConfig!(config));
    }
}
