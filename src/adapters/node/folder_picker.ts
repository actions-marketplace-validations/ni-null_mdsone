// ============================================================
// src/adapters/node/folder_picker.ts — 原生資料夾選擇器
// 對應 Python src/folder_picker.py
// Windows: PowerShell FolderBrowserDialog
// macOS:   osascript (AppleScript)
// Linux:   靜默略過
// ============================================================

import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import type { Config } from "../../core/types.js";
import { dirExists } from "./fs.js";

// ── 平台分派 ──────────────────────────────────────────────

/**
 * 叫出 OS 原生資料夾選擇對話框。
 * 回傳選擇的路徑字串，使用者取消或發生錯誤時回傳 null。
 */
export async function pickDirectory(prompt: string = "請選擇資料夾"): Promise<string | null> {
  switch (os.platform()) {
    case "win32":  return pickDirectoryWindows(prompt);
    case "darwin": return pickDirectoryMacOS(prompt);
    default:       return null;  // Linux / 其他：靜默略過
  }
}

// ── Windows ───────────────────────────────────────────────

function pickDirectoryWindows(prompt: string): string | null {
  const escapedPrompt = prompt.replace(/'/g, "''");  // PowerShell 單引號跳脫
  const psScript = [
    "Add-Type -AssemblyName System.Windows.Forms;",
    "$d = New-Object System.Windows.Forms.FolderBrowserDialog;",
    `$d.Description = '${escapedPrompt}';`,
    "$d.ShowNewFolderButton = $true;",
    "$r = $d.ShowDialog();",
    "if ($r -eq 'OK') { Write-Output $d.SelectedPath }",
  ].join("");

  try {
    const output = execFileSync("powershell", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      psScript,
    ], { encoding: "utf-8", timeout: 120_000 });
    const p = output.trim();
    return p || null;
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err.code === "ENOENT") {
      console.warn("[WARN] PowerShell not found, skipping folder dialog.");
    } else if (err.code === "ETIMEDOUT") {
      console.warn("[WARN] Folder dialog timed out.");
    } else {
      console.warn(`[WARN] Windows folder dialog error: ${err.message ?? e}`);
    }
    return null;
  }
}

// ── macOS ─────────────────────────────────────────────────

function pickDirectoryMacOS(prompt: string): string | null {
  const escapedPrompt = prompt.replace(/"/g, '\\"');
  const script = `choose folder with prompt "${escapedPrompt}"`;

  let hfsPath: string;
  try {
    hfsPath = execFileSync("osascript", ["-e", script], {
      encoding: "utf-8",
      timeout: 120_000,
    }).trim();
  } catch {
    return null;  // 使用者取消
  }

  if (!hfsPath) return null;

  // HFS path → POSIX path
  try {
    const posixPath = execFileSync("osascript", ["-e", `POSIX path of ("${hfsPath}")`], {
      encoding: "utf-8",
      timeout: 10_000,
    }).trim();
    return posixPath ? posixPath.replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

// ── 高層封裝 ──────────────────────────────────────────────

/**
 * 若 --source / --output 均未指定，且來源目錄不存在，
 * 則在 Windows / macOS 上開啟原生選資料夾對話框。
 * 回傳 Partial<Config> 更新，或 null（表示使用者取消，呼叫方應 exit(1)）。
 *
 * 對應 Python prompt_missing_paths()。
 */
export async function promptMissingPaths(
  config: Config,
  cliSource?: string,
  cliOutput?: string,
  cliOutputDir?: string,
): Promise<Partial<Config> | null> {
  const platform = os.platform();
  if (platform !== "win32" && platform !== "darwin") return {};

  // 若任一路徑已明確指定，略過對話框
  if (cliSource || cliOutput || cliOutputDir) return {};
  if (dirExists(config.markdown_source_dir)) return {};

  console.info("[INFO] No folder specified — opening folder picker...");
  const chosen = await pickDirectory("選擇 Markdown 資料夾（來源與輸出相同）");

  if (!chosen) {
    return null;  // 使用者取消
  }

  // 清理 site_title 為合法檔名
  const safeTitle = config.site_title.replace(/[\\/:*?"<>|]/g, "_");
  const outputFile = path.join(chosen, `${safeTitle}.html`);

  console.info(`[INFO] Folder: ${chosen}`);
  console.info(`[INFO] Output: ${outputFile}`);

  return {
    markdown_source_dir: chosen,
    output_file: outputFile,
  };
}
