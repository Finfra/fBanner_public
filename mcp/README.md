# fBanner MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that exposes the fBanner REST API as tools.
Split images, PDFs, and SVGs into grid cells directly from AI agents such as Claude Code and Claude Desktop.

## Prerequisites

The fBanner REST API server must be running:

| Server           | How to Run                                       |
| ---------------- | ------------------------------------------------ |
| macOS Native App | Launch fBanner.app (enable REST API in Settings)  |

Default server address: `http://localhost:3011`

---

## Installation

### Option 1: Global Install (Recommended)

```bash
npm install -g fbanner-mcp
```

### Option 2: npx (No Installation Required)

Run directly via `npx` in your MCP configuration.

### Option 3: From Source

```bash
git clone https://github.com/nowage/fBanner.git
cd fBanner/_public/mcp
npm install
```

---

## Configuration

### Claude Code

* Add to `~/.claude/settings.json` or project `.claude/settings.json`:
  - For Claude Desktop, add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "fbanner": {
      "command": "npx",
      "args": ["-y", "fbanner-mcp"]
    }
  }
}
```

* If running from source:
```json
  "mcpServers": {
    "fbanner": {
      "command": "node",
      "args": [
        "{PROJECT_ROOT-type-or-paste-it}/_public/mcp/index.js"
      ]
    }
  }
```

* To change the server address:
```json
{
  "mcpServers": {
    "fbanner": {
      "command": "npx",
      "args": ["-y", "fbanner-mcp", "--server=http://192.168.0.10:3011"]
    }
  }
}
```

### After Global Install

```json
{
  "mcpServers": {
    "fbanner": {
      "command": "fbanner-mcp"
    }
  }
}
```

---

## Tools

### 1. `health_check`

Check the fBanner server status.

**Parameters**: None

**Response example**:
```json
{
  "status": "ok",
  "app": "fBanner",
  "version": "1.0",
  "port": 3011
}
```

---

### 2. `get_status`

Get the current application state including loaded file info, split configuration, and export progress.

**Parameters**: None

**Response example**:
```json
{
  "success": true,
  "data": {
    "appState": "loaded",
    "file": {
      "fileName": "banner",
      "fileExtension": "png",
      "category": "bitmap",
      "pixelWidth": 1920,
      "pixelHeight": 1080
    },
    "config": {
      "rows": 2,
      "cols": 3,
      "exportFormat": "bitmap"
    }
  }
}
```

---

### 3. `get_config`

Get the current grid split and export settings.

**Parameters**: None

---

### 4. `update_config`

Update split configuration. Only provided fields are changed; omitted fields retain their current values.

**Parameters**:

| Name                 | Type    | Required | Description                                      |
| -------------------- | ------- | -------- | ------------------------------------------------ |
| `rows`               | integer | No       | Vertical splits (1-100)                           |
| `cols`               | integer | No       | Horizontal splits (1-100)                         |
| `ratioW`             | number  | No       | Horizontal ratio (0.1-10.0)                       |
| `ratioH`             | number  | No       | Vertical ratio (0.1-10.0)                         |
| `exportFormat`       | string  | No       | Output format: `bitmap`, `jpg`, `svg`, `pdf`      |
| `jpgQuality`         | number  | No       | JPEG quality (0.1-1.0)                            |
| `pdfExportMode`      | string  | No       | PDF export mode: `firstPage`, `allPages`, `selectedPage` |
| `selectedPdfPage`    | integer | No       | Selected PDF page number                          |
| `exportNameTemplate` | string  | No       | Filename template (`{name}_{rr}-{cc}`)            |

**Usage example** (ask Claude):
```
Set the grid to 3 rows and 4 columns with SVG export format
```

---

### 5. `load_file`

Load an image, PDF, or SVG file. Supported formats: PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG.

**Parameters**:

| Name   | Type   | Required | Description                |
| ------ | ------ | -------- | -------------------------- |
| `path` | string | Yes      | Absolute path to the file  |

**Usage example** (ask Claude):
```
Load the file /Users/me/Desktop/banner.png into fBanner
```

---

### 6. `export_files`

Export the currently loaded file as grid-split output files. A file must be loaded first via `load_file`.

**Parameters**:

| Name        | Type   | Required | Description                       |
| ----------- | ------ | -------- | --------------------------------- |
| `outputDir` | string | Yes      | Absolute path to output directory |

**Usage example** (ask Claude):
```
Export the split files to ~/Desktop/output
```

---

### 7. `split_one_step`

Perform file loading, configuration, and export in a single step. Recommended for automation.

**Parameters**:

| Name                 | Type    | Required | Default            | Description                   |
| -------------------- | ------- | -------- | ------------------ | ----------------------------- |
| `path`               | string  | Yes      | -                  | Input file path               |
| `outputDir`          | string  | Yes      | -                  | Output directory path         |
| `rows`               | integer | No       | `2`                | Vertical splits               |
| `cols`               | integer | No       | `2`                | Horizontal splits             |
| `ratioW`             | number  | No       | `1.0`              | Horizontal ratio              |
| `ratioH`             | number  | No       | `1.0`              | Vertical ratio                |
| `exportFormat`       | string  | No       | `"bitmap"`         | Output format                 |
| `jpgQuality`         | number  | No       | `0.8`              | JPEG quality                  |
| `exportNameTemplate` | string  | No       | `"{name}_{rr}-{cc}"` | Filename template           |

**Usage example** (ask Claude):
```
Split /Users/me/Desktop/banner.png into a 3x4 grid and save to ~/Desktop/output as PNG
```

---

## Debugging

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx fbanner-mcp
```

Opens the Inspector UI in your browser to test each tool interactively.

### Verify Server Connection

```bash
# Check if the fBanner REST API server is running
curl http://localhost:3011/
```

---

## Publishing to npm

```bash
cd _public/mcp
npm publish
```

---

## Architecture

```
Claude Code / Claude Desktop
    |
    | MCP (stdio)
    v
fbanner-mcp (this server)
    |
    | HTTP (REST API)
    v
fBanner Server (localhost:3011)
    └── macOS Native App (Swift)
```

---

## License

MIT
