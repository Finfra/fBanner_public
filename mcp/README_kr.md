# fBanner MCP Server

fBanner REST API를 [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) 도구로 제공하는 서버입니다.
AI 에이전트(Claude Code, Claude Desktop 등)에서 이미지, PDF, SVG를 그리드로 분리할 수 있습니다.

## 전제 조건

fBanner REST API 서버가 실행 중이어야 합니다:

| 서버              | 실행 방법                                        |
| ----------------- | ------------------------------------------------ |
| macOS 네이티브 앱 | fBanner.app 실행 (설정에서 REST API 활성화)       |

기본 서버 주소: `http://localhost:3011`

---

## 설치

### 방법 1: 글로벌 설치 (권장)

```bash
npm install -g fbanner-mcp
```

### 방법 2: npx (설치 없이 바로 실행)

별도 설치 없이 MCP 설정에서 `npx`로 직접 실행합니다.

### 방법 3: 소스에서 직접 실행

```bash
git clone https://github.com/nowage/fBanner.git
cd fBanner/_public/mcp
npm install
```

---

## 설정

### Claude Code

* `~/.claude/settings.json` 또는 프로젝트 `.claude/settings.json`에 추가:
  - Claude Desktop의 경우 `~/Library/Application Support/Claude/claude_desktop_config.json`에 추가:
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

* 소스에서 직접 실행했다면:
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

* 서버 주소를 변경하려면:
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

### 글로벌 설치 후 사용

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

## 제공 도구 (Tools)

### 1. `health_check`

fBanner 서버 상태를 확인합니다.

**파라미터**: 없음

**응답 예시**:
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

현재 앱 상태를 조회합니다 (로드된 파일 정보, 분리 설정, 내보내기 진행률 등).

**파라미터**: 없음

**응답 예시**:
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

현재 그리드 분리 설정을 조회합니다.

**파라미터**: 없음

---

### 4. `update_config`

그리드 분리 설정을 변경합니다. 제공된 필드만 업데이트되며 나머지는 유지됩니다.

**파라미터**:

| 이름                 | 타입    | 필수   | 설명                                              |
| -------------------- | ------- | ------ | ------------------------------------------------- |
| `rows`               | integer | 아니오 | 세로 분할 수 (1~100)                               |
| `cols`               | integer | 아니오 | 가로 분할 수 (1~100)                               |
| `ratioW`             | number  | 아니오 | 가로 비율 (0.1~10.0)                               |
| `ratioH`             | number  | 아니오 | 세로 비율 (0.1~10.0)                               |
| `exportFormat`       | string  | 아니오 | 출력 형식: `bitmap`, `jpg`, `svg`, `pdf`           |
| `jpgQuality`         | number  | 아니오 | JPEG 품질 (0.1~1.0)                               |
| `pdfExportMode`      | string  | 아니오 | PDF 내보내기 모드: `firstPage`, `allPages`, `selectedPage` |
| `selectedPdfPage`    | integer | 아니오 | 선택된 PDF 페이지 번호                              |
| `exportNameTemplate` | string  | 아니오 | 파일명 템플릿 (`{name}_{rr}-{cc}`)                  |

**사용 예시** (Claude에게 요청):
```
그리드를 3행 4열로 설정하고 SVG 형식으로 내보내기 해줘
```

---

### 5. `load_file`

이미지, PDF, SVG 파일을 로드합니다. 지원 형식: PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG.

**파라미터**:

| 이름   | 타입   | 필수 | 설명                    |
| ------ | ------ | ---- | ----------------------- |
| `path` | string | 예   | 파일의 절대 경로         |

**사용 예시** (Claude에게 요청):
```
_public/resource/contents/example1.png 파일을 fBanner에 로드해줘
```

---

### 6. `export_files`

현재 로드된 파일을 그리드 분리하여 내보냅니다. 먼저 `load_file`로 파일을 로드해야 합니다.

**파라미터**:

| 이름        | 타입   | 필수 | 설명                        |
| ----------- | ------ | ---- | --------------------------- |
| `outputDir` | string | 예   | 출력 디렉토리의 절대 경로    |

**사용 예시** (Claude에게 요청):
```
분리된 파일을 _public/resource/contents_result으로 내보내줘
```

---

### 7. `split_one_step`

파일 로드 + 설정 변경 + 내보내기를 한 번에 수행합니다. 자동화에 권장됩니다.

**파라미터**:

| 이름                 | 타입    | 필수   | 기본값               | 설명                  |
| -------------------- | ------- | ------ | -------------------- | --------------------- |
| `path`               | string  | 예     | -                    | 입력 파일 경로         |
| `outputDir`          | string  | 예     | -                    | 출력 디렉토리 경로     |
| `rows`               | integer | 아니오 | `2`                  | 세로 분할 수           |
| `cols`               | integer | 아니오 | `2`                  | 가로 분할 수           |
| `ratioW`             | number  | 아니오 | `1.0`                | 가로 비율             |
| `ratioH`             | number  | 아니오 | `1.0`                | 세로 비율             |
| `exportFormat`       | string  | 아니오 | `"bitmap"`           | 출력 형식             |
| `jpgQuality`         | number  | 아니오 | `0.8`                | JPEG 품질             |
| `exportNameTemplate` | string  | 아니오 | `"{name}_{rr}-{cc}"` | 파일명 템플릿          |

**사용 예시** (Claude에게 요청):
```
_public/resource/contents/example1.png를 3x4 그리드로 분리해서 _public/resource/contents_result에 PNG로 저장해줘
```

---

## 디버깅

### MCP Inspector로 테스트

```bash
npx @modelcontextprotocol/inspector npx fbanner-mcp
```

브라우저에서 Inspector UI가 열리며, 각 도구를 직접 테스트할 수 있습니다.

### 서버 연결 확인

```bash
# fBanner REST API 서버가 실행 중인지 확인
curl http://localhost:3011/
```

---

## npm 배포

```bash
cd _public/mcp
npm publish
```

---

## 아키텍처

```
Claude Code / Claude Desktop
    |
    | MCP (stdio)
    v
fbanner-mcp (이 서버)
    |
    | HTTP (REST API)
    v
fBanner Server (localhost:3011)
    └── macOS 네이티브 앱 (Swift)
```

---

## 라이선스

MIT
