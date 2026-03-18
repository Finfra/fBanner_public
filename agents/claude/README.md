# fBanner Claude Code Plugin

A Claude Code plugin that splits images, PDFs, and SVGs into grid tiles via the fBanner REST API.
After installation, split files instantly using slash commands in Claude Code.

---

## Plugin Structure

```
.claude-plugin/
└── plugin.json          # Plugin manifest
skills/
└── fbanner/
    └── SKILL.md         # Image grid split skill
```

---

## Skills

### `fbanner` — Image Grid Splitter

Splits images, PDFs, and SVGs into grid tiles via the fBanner REST API.

**Usage:**
```
/fbanner:fbanner split /tmp/banner.png --rows=3 --cols=4
/fbanner:fbanner load /tmp/image.png
/fbanner:fbanner config --rows=2 --cols=3 --format=svg
/fbanner:fbanner export /tmp/output
/fbanner:fbanner status
```

**Features:**
- Guides user to launch fBanner.app if server is not running
- Supports PNG, JPG, TIFF, BMP, GIF, PDF, SVG input
- Export as bitmap (PNG), JPG, SVG, or PDF
- One-step split command (load + configure + export)
- Partial configuration updates

**Options:**

| Option             | Description              | Default                 |
| ------------------ | ------------------------ | ----------------------- |
| `--rows=<N>`       | Vertical splits          | `2`                     |
| `--cols=<N>`       | Horizontal splits        | `2`                     |
| `--format=<fmt>`   | Export format             | `bitmap`                |
| `--output=<dir>`   | Output directory          | `/tmp/fbanner-output`   |
| `--ratio-w=<N>`    | Horizontal ratio          | `1.0`                   |
| `--ratio-h=<N>`    | Vertical ratio            | `1.0`                   |
| `--server=<url>`   | Change server address     | `http://localhost:3011` |

**API Summary:**

| Method | Endpoint      | Description                              |
| ------ | ------------- | ---------------------------------------- |
| GET    | `/`           | Health check                             |
| GET    | `/api/status` | App state and loaded file info           |
| GET    | `/api/config` | Current split configuration              |
| PUT    | `/api/config` | Update split configuration               |
| POST   | `/api/load`   | Load a file by path                      |
| POST   | `/api/export` | Export split files to directory           |
| POST   | `/api/split`  | One-step: load + configure + export      |

---

## Installation

### Option 1: Plugin Install (Recommended)

```bash
/plugin marketplace add nowage/fBanner
/plugin install fbanner
```

### Option 2: Manual Copy

Copy the plugin directory to your project:

```bash
# From fBanner project root
cp -r _public/agents/claude/.claude-plugin .claude-plugin
cp -r _public/agents/claude/skills .claude/skills
```

### Option 3: Symbolic Link

```bash
ln -sf _public/agents/claude/skills/fbanner .claude/skills/fbanner
```

---

## Prerequisites

The fBanner REST API server must be running:

| Server           | How to Run                                       |
| ---------------- | ------------------------------------------------ |
| macOS Native App | Launch fBanner.app (enable REST API in Settings) |

> If the server is not running, the skill will prompt the user to launch fBanner.app.

---

## Related Extensions

| Extension                  | Location       | Description                                            |
| -------------------------- | -------------- | ------------------------------------------------------ |
| [MCP Server](../../mcp/)  | `_public/mcp/` | Grid split via MCP protocol (Claude Desktop compatible) |

---

## License

MIT
