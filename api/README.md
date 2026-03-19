# fBanner REST API Documentation

## Overview

fBanner is a macOS app that splits image/PDF/SVG files into a Row x Col grid and exports them. The REST API enables automation of file loading, split configuration, and export operations.

| Server Implementation | Tech Stack | Default Port |
|-----------------------|------------|--------------|
| macOS native app | Swift / Network.framework (NWListener) | 3011 |

The API server is **disabled by default** and must be explicitly enabled in the app settings.

> OpenAPI 3.0 spec: [openapi.yaml](./openapi.yaml)

---

## Security

- The API server is **disabled by default** and must be explicitly enabled in the app settings.
- By default, only **localhost (127.0.0.1)** connections are allowed.
- External access can be enabled via the "Allow External Access" checkbox in settings, where you can specify allowed IP ranges in CIDR notation (e.g., `192.168.0.0/24`).
- Connections from IPs outside the allowed CIDR range are immediately rejected (connection cancelled without HTTP response).
- localhost is always allowed regardless of CIDR settings.

---

## Endpoints

### 1. Health Check

```
GET /
```

**Response**:
```json
{
  "status": "ok",
  "app": "fBanner",
  "version": "1.0",
  "port": 3011
}
```

---

### 2. Application Status

```
GET /api/status
```

Returns the current application state including loaded file info, split configuration, and export progress.

**Response example** (file loaded):
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
      "pixelHeight": 1080,
      "url": "/path/to/banner.png"
    },
    "config": {
      "rows": 2,
      "cols": 3,
      "ratioW": 1.0,
      "ratioH": 1.0,
      "exportFormat": "bitmap",
      "jpgQuality": 0.8,
      "exportNameTemplate": "{name}_{rr}-{cc}"
    }
  }
}
```

---

### 3. Get Split Configuration

```
GET /api/config
```

Returns the current grid split and export settings.

---

### 4. Update Split Configuration

```
PUT /api/config
Content-Type: application/json
```

#### Request Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `rows` | integer | No | - | Number of vertical splits (1~100) |
| `cols` | integer | No | - | Number of horizontal splits (1~100) |
| `ratioW` | number | No | - | Horizontal ratio (0.1~10.0) |
| `ratioH` | number | No | - | Vertical ratio (0.1~10.0) |
| `exportFormat` | string | No | - | Output format: `bitmap` (PNG), `jpg`, `svg`, `pdf` |
| `jpgQuality` | number | No | - | JPEG quality (0.1~1.0, applicable when exportFormat is bitmap or jpg) |
| `pdfExportMode` | string | No | - | PDF export mode: `firstPage`, `allPages`, `selectedPage` |
| `selectedPdfPage` | integer | No | - | Selected PDF page number (only when pdfExportMode is selectedPage) |
| `exportNameTemplate` | string | No | - | Output filename template |

Only provided fields are changed; omitted fields retain their current values.

#### Request Example

```json
{
  "rows": 3,
  "cols": 4,
  "exportFormat": "bitmap"
}
```

**Errors**:

| Status Code | Cause | Response Example |
|-------------|-------|------------------|
| 400 | Invalid parameter value | `{"success": false, "error": "Invalid parameter"}` |

---

### 5. Load File

```
POST /api/load
Content-Type: application/json
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | Yes | Absolute path to the input file |

#### Supported Formats

PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG

#### Request Example

```json
{
  "path": "/path/to/banner.png"
}
```

#### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "fileName": "banner",
    "fileExtension": "png",
    "category": "bitmap",
    "pixelWidth": 1920,
    "pixelHeight": 1080,
    "url": "/path/to/banner.png"
  }
}
```

**Errors**:

| Status Code | Cause | Response Example |
|-------------|-------|------------------|
| 400 | Unsupported format or invalid path | `{"success": false, "error": "Unsupported file format. (PNG, JPG, TIFF, BMP, GIF, PDF, SVG)"}` |

---

### 6. Export

```
POST /api/export
Content-Type: application/json
```

Exports the currently loaded file as grid-split output files to the specified directory. A file must be loaded first via `/api/load`.

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `outputDir` | string | Yes | Absolute path to the output directory |

#### Request Example

```json
{
  "outputDir": "/path/to/output"
}
```

#### Response

**Success (200)**:
```json
{
  "success": true,
  "data": {
    "fileCount": 6,
    "outputDir": "/path/to/output",
    "files": [
      "banner_01-01.png",
      "banner_01-02.png",
      "banner_01-03.png",
      "banner_02-01.png",
      "banner_02-02.png",
      "banner_02-03.png"
    ]
  }
}
```

**Errors**:

| Status Code | Cause | Response Example |
|-------------|-------|------------------|
| 409 | No file loaded | `{"success": false, "error": "No file loaded. Load a file first via /api/load."}` |

---

### 7. One-Step Split (Load + Configure + Export)

```
POST /api/split
Content-Type: application/json
```

Performs file loading, configuration update, and export in a single request. **This is the recommended endpoint for automation scripts.**

#### Request Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `path` | string | Yes | - | Absolute path to the input file |
| `outputDir` | string | Yes | - | Absolute path to the output directory |
| `rows` | integer | No | 2 | Number of vertical splits (1~100) |
| `cols` | integer | No | 2 | Number of horizontal splits (1~100) |
| `ratioW` | number | No | 1.0 | Horizontal ratio (0.1~10.0) |
| `ratioH` | number | No | 1.0 | Vertical ratio (0.1~10.0) |
| `exportFormat` | string | No | `bitmap` | Output format: `bitmap` (PNG), `jpg`, `svg`, `pdf` |
| `jpgQuality` | number | No | 0.8 | JPEG quality (0.1~1.0) |
| `exportNameTemplate` | string | No | `{name}_{rr}-{cc}` | Output filename template |

#### Request Example

```json
{
  "path": "resource/contents/example1.png",
  "outputDir": "resource/contents_result",
  "rows": 3,
  "cols": 4,
  "exportFormat": "bitmap"
}
```

**Errors**:

| Status Code | Cause | Response Example |
|-------------|-------|------------------|
| 400 | Invalid parameters or unsupported format | `{"success": false, "error": "..."}` |

---

## Usage Examples

### cURL

```bash
# Health check
curl http://localhost:3011/

# Load file
curl -X POST http://localhost:3011/api/load \
  -H "Content-Type: application/json" \
  -d '{"path": "resource/contents/example1.png"}'

# Update split configuration
curl -X PUT http://localhost:3011/api/config \
  -H "Content-Type: application/json" \
  -d '{"rows": 3, "cols": 4}'

# Export
curl -X POST http://localhost:3011/api/export \
  -H "Content-Type: application/json" \
  -d '{"outputDir": "resource/contents_result"}'

# One-step split (recommended)
curl -X POST http://localhost:3011/api/split \
  -H "Content-Type: application/json" \
  -d '{"path": "resource/contents/example1.png", "outputDir": "resource/contents_result", "rows": 2, "cols": 3}'

# Get current status
curl http://localhost:3011/api/status

# Get current configuration
curl http://localhost:3011/api/config
```

### Python

```python
import requests

BASE_URL = 'http://localhost:3011'

# One-step split
response = requests.post(
    f'{BASE_URL}/api/split',
    json={
        'path': 'resource/contents/example1.png',
        'outputDir': 'resource/contents_result',
        'rows': 2,
        'cols': 3,
        'exportFormat': 'bitmap'
    }
)

result = response.json()
print(f"Exported files: {result['data']['fileCount']}")
print(f"File list: {result['data']['files']}")
```

---

## Split Configuration Options

| Option | Description | Range | Default |
|--------|-------------|-------|---------|
| rows | Number of vertical splits | 1~100 | 2 |
| cols | Number of horizontal splits | 1~100 | 2 |
| ratioW | Horizontal ratio | 0.1~10.0 | 1.0 |
| ratioH | Vertical ratio | 0.1~10.0 | 1.0 |
| exportFormat | Output format | bitmap (PNG), jpg, svg, pdf | bitmap |
| jpgQuality | JPEG quality | 0.1~1.0 | 0.8 |
| exportNameTemplate | Filename template | - | `{name}_{rr}-{cc}` |

### Filename Template Placeholders

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{name}` | Original filename (without extension) | banner |
| `{rr}` | Row number (zero-padded) | 01 |
| `{cc}` | Column number (zero-padded) | 02 |

Output example: `banner_01-02.png`

---

## Testing

```bash
# Automated tests (default: localhost:3011)
bash api/test-api.sh

# Remote server tests
bash api/test-api.sh --server=http://192.168.0.10:3011
```

Test cases:
1. Health check (GET `/`) and response validation
2. Application status (GET `/api/status`)
3. Get split configuration (GET `/api/config`)
4. Update split configuration (PUT `/api/config`)
5. Load file with invalid path returns 400
6. Export without file loaded returns 409
7. 404 Not Found response
8. Load + Export integration test (requires image in `resource/`)
9. One-step split (2x2 grid) integration test
