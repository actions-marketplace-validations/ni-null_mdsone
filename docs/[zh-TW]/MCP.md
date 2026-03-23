# MCP 接入指南

本頁僅說明如何把 `mdsone` 接入常見代理工具，讓代理可直接使用 `mdsone mcp`。

## 1. 先全域安裝

```bash
npm install -g mdsone
mdsone --version
mdsone mcp --help
```

> 全域安裝請使用 `npm install -g mdsone`。  
> `npx` 適合一次性執行，不是全域安裝指令。

## 2. 通用啟動方式（stdio）

- command: `mdsone`
- args: `["mcp"]`

## 3. 各工具接入

### 3.1 Codex CLI / Codex App

```bash
codex mcp add mdsone -- mdsone mcp
codex mcp list
```

### 3.2 Claude Desktop

Windows 設定檔：

- `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mdsone": {
      "command": "mdsone",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

### 3.3 Cursor

可使用：

- 專案層：`.cursor/mcp.json`
- 全域層：`~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "mdsone": {
      "type": "stdio",
      "command": "mdsone",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

### 3.4 VS Code + GitHub Copilot（Agent）

建議放在專案：

- `.vscode/mcp.json`

```json
{
  "servers": {
    "mdsone": {
      "type": "stdio",
      "command": "mdsone",
      "args": ["mcp"]
    }
  }
}
```

### 3.5 Cline（VS Code Extension）

在 Cline 的 MCP 設定加入：

```json
{
  "mcpServers": {
    "mdsone": {
      "command": "mdsone",
      "args": ["mcp"],
      "env": {}
    }
  }
}
```

## 4. 官方參考資料

- [Model Context Protocol 入門](https://modelcontextprotocol.org/docs/getting-started/intro)
- [Claude Code / Claude Desktop MCP](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Cursor MCP](https://docs.cursor.com/en/context/model-context-protocol)
- [GitHub Copilot MCP](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Cline MCP 設定指南](https://docs.cline.bot/mcp/configuring-mcp-servers)
