---
name: fbanner-api
description: Control the fBanner macOS application via its REST API (localhost:3011). Use this skill when you need to load files, configure split options, or export images/PDFs in fBanner.
---
# fBanner API Skill

This skill allows Gemini to control the running fBanner macOS application through its local REST API.

## Endpoints

Base URL: `http://localhost:3011`

- `GET /`
  Health check. Returns server status, app name, and version.
  
- `GET /api/status`
  Get the current application state, including loaded file info, split configuration, and export progress.

- `GET /api/config`
  Get the current split configuration.

- `POST /api/load`
  Load a file into fBanner.
  ```bash
  curl -X POST http://localhost:3011/api/load \
       -H "Content-Type: application/json" \
       -d '{"filePath":"/absolute/path/to/file.png"}'
  ```

- `POST /api/export`
  Start exporting the split images/PDFs.
  ```bash
  curl -X POST http://localhost:3011/api/export \
       -H "Content-Type: application/json" \
       -d '{"outputDir":"/absolute/path/to/output"}'
  ```

- `POST /api/split`
  Execute a single split step manually.
  ```bash
  curl -X POST http://localhost:3011/api/split
  ```

## Usage Guidelines
- **Prerequisites**: Ensure the fBanner app is running and the API server is enabled in the app's settings before making any calls.
- **Execution**: Use the `run_shell_command` tool with `curl` to interact with these endpoints.
- **State Check**: Always check `/api/status` before attempting to export or manipulate to verify that a file is loaded properly.
- **Paths**: Ensure that paths provided in payload (`filePath`, `outputDir`) are absolute paths.