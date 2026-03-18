---
title: fBanner 사용자 매뉴얼 및 기능 명세서 (User Manual & Functional Specification)
description: 본 문서는 고해상도 이미지, PDF, SVG 파일을 불러와 원하는 그리드 형태와 비율로 정밀하게 분할하고, 다양한 포맷(PNG, PDF, SVG)으로 내보내는 fBanner의 핵심 사용법 및 고급 기능을 상세히 안내합니다.
date: 2026.03.14
tags: [매뉴얼, 사용자 가이드, 기능 명세, 분할]
---

# fBanner란? (Overview)

fBanner는 대용량 비트맵 이미지뿐만 아니라 벡터 기반인 PDF와 SVG를 빠르고 간편하게 분배/병합(분할)할 수 있는 macOS 전용 생산성 도구입니다. 복잡한 그래픽 디자인 툴 없이도 드래그 앤 드롭만으로 이미지를 로드하고, 다이내믹한 미니맵(MiniMap)을 통해 실시간 설정 결과를 눈으로 확인하며 완벽한 해상도 손실 없는 벡터 내보내기/렌더링 분할을 지원합니다.

---

# 1. 파일 입력 및 로드 (Drag & Drop Zone)

사용자는 마우스 드래그나 파일 선택 창을 통해 원본 소스를 fBanner에 즉시 로드할 수 있습니다. 로드 중 발생하는 형식 오류나 손상 여부도 사전에 스마트하게 검증합니다.

## 1.1. 다목적 파일 포맷 지원 및 식별
- **지원 포맷**: 일반 이미지 포맷(`.png`, `.jpeg`, `.tiff`, `.bmp`, `.gif`)뿐만 아니라, **인쇄/디자인용 다큐먼트(`.pdf`)**, **웹 벡터 그래픽(`.svg`)**까지 폭넓게 지원합니다.
- **예외 처리 및 필터링(Error Handling)**: `.mp4`, `.zip`, 혹은 0바이트 손상 파일 등 미지원 포맷이 드롭될 경우, 즉각 안내 메시지와 함께 앱 크래시를 방지하고 이전 작업 상태를 그대로 살려냅니다 (안전 설계). 단일 문서 드롭 시 다수 파일이 혼재된 경우 가장 첫 번째 유효 파일을 우선 로드합니다.

## 1.2. SVG/PDF 실시간 파싱 ও 렌더링
SVG 파일을 불러올 경우 임시 렌더링 엔진(Canvas)이 SVG 패스를 파싱해 비율에 맞는 썸네일로 구성해 줍니다. 텍스트 정보뿐 아니라 실제 형태를 미니맵에 뿌려줍니다. 여러 장의 PDF 문서가 드롭되면 기본적으로 "첫 번째 페이지"를 타깃으로 삼아 분할 작업을 세팅합니다.

---

# 2. 강력한 분할 설정 엔진 및 미니맵 (Split Configuration)

fBanner의 꽃은 단순 균등 분할을 넘어, 개별 행/열별로 다르게 가중치를 주어 한 번의 작업으로 복합 레이아웃을 계산해 내는 `SplitCalculator` 엔진입니다.

## 2.1. 행(Row)과 열(Col) + 비율 조절 가중치
- **직관적 스테퍼 & 텍스트 제어**: 행과 열을 1부터 100단위 대형 그리드까지 자유롭게 쪼갭니다 (기본 2x2).
- **불균등 가중치 비율 알고리즘 (`ratioW`, `ratioH`)**: 단순 반반이 아니라, "비율 2.0"을 주면 짝수 인덱스 셀이 홀수 인덱스 셀 대비 2배 길이로 계산됩니다. 이 독특한 공식(`calculateCellLengths`)을 통해 인스타그램 레이아웃, 혹은 특수한 비대칭 웹 배너 그리드를 한 번의 내보내기로 뚝딱 제작 가능합니다.

## 2.2. 이미지 가로/세로 오리지널 비율(Aspect Ratio) 강제
사용자가 입력한 소스 이미지의 원본 종횡비(ex: 1.5, 0.8)를 초기값으로 읽어오지만, 출력물의 기준 핏(Fit)을 수동으로 변경하고 싶다면 Slider/Stepper를 통해 0.1 ~ 10.0 배율 범위 내에서 세부 조정할 수 있습니다. 

## 2.3. 실시간 미니맵(MiniMap) 피드백 시각화
- 우측 설정 패널(ConfigPanel)에서 숫자를 0.1이라도 변경하면 좌측 미니맵 화면에 즉시대응(0 Delay)합니다. 렌더링 결과로 추출될 **[행 번호_열 번호] (예: 01_03)** 레이블과 1px의 정교한 연보라색 격자선이 오버레이 되어 최종 결과물을 정확히 보장합니다 (너무 작은 셀은 레이블을 교묘하게 감추어 시각 공해를 방지).

---

# 3. 고품질 내보내기 엔진 (Export Systems)

출력 포맷 세 가지(PNG, PDF, SVG) 각각 다른 전용 서비스 백엔드 방식을 태워 손실 최소화를 추구합니다.

## 3.1. Bitmap 픽셀 추출 모델 (`ImageSplitService`)
대용량(10,000px 이상) 비트맵을 분할할 때도 앱이 멈추지 않도록 `CGImage.cropping` 객체를 통해 메모리 안전성을 극대화합니다. 계산된 가중치 좌표 기반 2D 배열에 맞추어 N개의 투명/불투명 `.png` 조각 파일 패턴(`{원본이름}_{row}-{col}.png`)으로 초고속 분리해 디스크에 기록합니다.

## 3.2. PDF 직접 기록 모델 (`PDFExportService`)
단순 이미지가 아니라 인쇄용 PDF 분할을 수행할 경우, `PDFDocument`의 ViewBridge 호환 에러를 방지하고자 **Apple CoreGraphics (`CGContext`) 레벨**로 내려가 페이지(MediaBox)를 다이렉트로 Write 합니다 (`.pdf`). 벡터 텍스트 데이터와 고해상도 해상도를 유지하여 결과물을 만듭니다.

## 3.3. SVG 임베딩 아키텍처 (`SVGExportService`)
가장 진보한 분할 중 하나는 SVG를 SVG로 자르거나 비트맵을 SVG로 감싸는 기능입니다. 외부 절대경로 의존에 따른 엑박 방지를 위해, 추출된 이미지 조각 전체를 **Base64 인코딩화(`data:image/png;base64,...`)** 하여 독립적인 단일 `<svg>` DOM 태그 안에 임베딩(Embedding)합니다. 이를 통해 웹 서버 어디에 올려도 깨짐 없는 레이아웃 소스를 확보할 수 있습니다.

---

# 4. 편의성, 히스토리(History) 및 다국어 지원

이 외에도 fBanner는 유저의 워크플로우를 극대화하기 위한 시스템 융합 관리를 자랑합니다.

## 4.1. 히스토리 & 썸네일 기반 상태 복원 (Time Machine)
- 사용자가 "내보내기(Export)"를 성공리에 마칠 때마다 "어느 파일 경로를 어떤 Row, Col, 비율 세팅으로 내보냈는지" JSON 형태의 이력을 영구 보관합니다.
- (Cmd + ,) 환경설정의 **History 탭**을 열면 작은 아이콘 썸네일(20x20 크롭 이미지)과 함께 이력 목록을 확인할 수 있습니다. 클릭 한 번이면, 옛날 세팅값과 원본 파일이 과거 모습 그대로 메인 미니맵 화면에 **자동 복원(Restore)** 됩니다.

## 4.2. 8개 국어 글로벌 스케일 다국어 지원 (Localization)
한국어 뿐 아니라 영어, 일본어, 중국어 간체, 중국어 번체, 스페인어, 프랑스어, 독일어 등 8개의 글로벌 언어 로케일(`Localizable.xcstrings`)을 일괄 지원하여, 세계 어디서나 시스템 언어에 맞게 앱 UI와 에러 메시지가 자연스레 치환됩니다.

## 4.3. 설정 유지 (Keep Settings) 및 단축키
- 여러 파일을 공장처럼 돌려야 할 때 설정 패널의 값이 초기화되지 않도록 **[새 파일 로드 시 기존 설정값 유지 기능]**을 On/Off 할 수 있습니다.
- 글로벌 단축키 `Shift+Cmd+E`를 활용하여 마우스를 움직이지 않고도 빠른 "내보내기" 액션을 취할 수 있습니다.

---

# 5. 내장 REST API 서버 (Built-in REST API Server)

fBanner에 내장된 NWListener(`Network.framework`) 기반 HTTP REST 서버로, 외부 프로그램이나 스크립트에서 이미지 분할 기능을 프로그래밍 방식으로 제어할 수 있습니다. cURL, Postman, 커스텀 스크립트 등을 통해 파일 로드, 분할 설정 변경, 내보내기를 자동화할 수 있습니다.

## 5.1. 보안 정책

### 기본 접근 제어
- REST API 서버는 기본적으로 **비활성화(OFF)** 상태이며, 사용자가 설정(Cmd+,)의 API 탭에서 명시적으로 활성화해야 동작합니다.
- 기본 수신 범위는 **localhost(127.0.0.1)** 전용으로, 외부 네트워크에서의 접근은 차단됩니다.

### CIDR 기반 외부 접속 제어
- 설정 화면에서 **"외부 접속 허용"** 체크박스를 활성화하면 CIDR 입력 필드를 수정할 수 있습니다.
- CIDR 표기법으로 허용할 IP 범위를 지정합니다 (예: `192.168.0.0/24`, `10.0.0.0/8`).
- 쉼표(`,`)로 여러 대역을 동시 지정할 수 있습니다.
- **외부 접속 허용이 꺼진 상태**: localhost만 접근 가능 (loopback 인터페이스만 바인딩, CIDR 필드 비활성화).
- **외부 접속 허용이 켜진 상태**: CIDR 범위 + localhost 접근 가능.
- 허용 범위에 해당하지 않는 IP의 연결은 즉시 거부(cancel)됩니다.

## 5.2. 기본 설정

| 항목 | 기본값 | 비고 |
|------|--------|------|
| **기본 포트** | `3011` | 설정 화면에서 변경 가능 |
| **API 활성화 상태** | `꺼짐 (OFF)` | 사용자가 설정에서 명시적으로 활성화해야 동작 |
| **외부 접속 허용** | `꺼짐 (OFF)` | 체크 시 CIDR 입력 가능 |
| **허용 CIDR** | `192.168.0.0/24` | 외부 접속 허용 시 기본 범위 |

## 5.3. 엔드포인트 (7개)

### `GET /` — 서버 상태 확인 (헬스 체크)

서버가 정상 동작 중인지 확인합니다.

**응답 예시:**
```json
{"status":"ok","app":"fBanner","version":"1.0","port":3011}
```

### `GET /api/status` — 앱 현재 상태 조회

로드된 파일 정보, 분리 설정, 내보내기 진행률 등 앱의 전체 상태를 반환합니다.

**응답 예시 (파일 로드됨):**
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
      "rows": 2, "cols": 3,
      "ratioW": 1.0, "ratioH": 1.0,
      "exportFormat": "bitmap"
    }
  }
}
```

### `GET /api/config` — 현재 분리 설정 조회

현재 그리드 분할 및 내보내기 설정을 반환합니다.

### `PUT /api/config` — 분리 설정 변경 (부분 업데이트)

제공된 필드만 변경하고 나머지는 현재 값을 유지합니다. UI(ConfigPanelView, MiniMapView)에 실시간 반영됩니다.

**요청 예시:**
```json
{"rows": 3, "cols": 4, "exportFormat": "svg"}
```

### `POST /api/load` — 파일 로드

절대 경로로 이미지, PDF, SVG 파일을 로드합니다. 로드된 파일은 앱의 DropZoneView에 표시됩니다.

**요청 예시:**
```json
{"path": "/path/to/banner.png"}
```

**지원 포맷:** PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG

### `POST /api/export` — 내보내기 실행

현재 로드된 파일을 분할하여 지정된 디렉토리에 내보냅니다. `/api/load`로 파일이 로드된 상태여야 합니다.

**요청 예시:**
```json
{"outputDir": "/path/to/output"}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "fileCount": 6,
    "outputDir": "/path/to/output",
    "files": ["banner_01-01.png", "banner_01-02.png", "banner_01-03.png",
              "banner_02-01.png", "banner_02-02.png", "banner_02-03.png"]
  }
}
```

### `POST /api/split` — 원스텝 분할 (로드 + 설정 + 내보내기)

파일 로드, 설정 변경, 내보내기를 한 번의 요청으로 수행합니다. 자동화 스크립트에 권장되는 엔드포인트입니다.

**요청 예시:**
```json
{
  "path": "/tmp/banner.png",
  "outputDir": "/tmp/output",
  "rows": 3,
  "cols": 4,
  "exportFormat": "bitmap"
}
```

## 5.4. 설정 필드 레퍼런스

| 필드 | 타입 | 범위 | 기본값 | 설명 |
|------|------|------|--------|------|
| `rows` | int | 1-100 | 2 | 세로 분할 수 |
| `cols` | int | 1-100 | 2 | 가로 분할 수 |
| `ratioW` | float | 0.1-10.0 | 1.0 | 가로 비율 가중치 |
| `ratioH` | float | 0.1-10.0 | 1.0 | 세로 비율 가중치 |
| `exportFormat` | string | bitmap/jpg/svg/pdf | bitmap | 출력 파일 형식 |
| `jpgQuality` | float | 0.1-1.0 | 0.8 | JPEG 품질 (exportFormat이 jpg일 때) |
| `pdfExportMode` | string | firstPage/allPages/selectedPage | firstPage | PDF 내보내기 모드 |
| `selectedPdfPage` | int | 1+ | 1 | PDF 페이지 번호 (selectedPage 모드일 때) |
| `exportNameTemplate` | string | - | `{name}_{rr}-{cc}` | 출력 파일명 템플릿 |

## 5.5. cURL 사용 예시

```bash
# 서버 상태 확인
curl http://localhost:3011/

# 파일 로드
curl -X POST http://localhost:3011/api/load \
  -H "Content-Type: application/json" \
  -d '{"path":"/tmp/banner.png"}'

# 설정 변경
curl -X PUT http://localhost:3011/api/config \
  -H "Content-Type: application/json" \
  -d '{"rows":3,"cols":4,"exportFormat":"svg"}'

# 내보내기 실행
curl -X POST http://localhost:3011/api/export \
  -H "Content-Type: application/json" \
  -d '{"outputDir":"/tmp/output"}'

# 원스텝 분할 (로드 + 설정 + 내보내기)
curl -X POST http://localhost:3011/api/split \
  -H "Content-Type: application/json" \
  -d '{"path":"/tmp/banner.png","outputDir":"/tmp/output","rows":3,"cols":4}'

# 앱 상태 조회
curl http://localhost:3011/api/status | python3 -m json.tool
```

### 에러 응답

| 상태 코드 | 응답 | 원인 |
|-----------|------|------|
| `400` | `{"success":false,"error":"..."}` | 잘못된 JSON, 미지원 파일 형식, 유효하지 않은 경로 |
| `404` | `{"success":false,"error":"Not Found"}` | 존재하지 않는 엔드포인트 |
| `409` | `{"success":false,"error":"..."}` | 파일 미로드 상태에서 내보내기 시도 |
| `500` | `{"success":false,"error":"..."}` | 내부 서버 오류 |

---

# 6. Claude Code Skill (자동화 연동)

fBanner의 REST API를 Claude Code의 **slash command**로 제공하는 플러그인입니다. Claude Code 환경에서 `/fbanner:fbanner` 명령어를 통해 이미지 분할을 직접 수행할 수 있습니다.

## 6.1. 설치 방법

### 방법 1: 플러그인 설치 (권장)
```bash
/plugin marketplace add nowage/fBanner
/plugin install fbanner
```

### 방법 2: 수동 복사
```bash
# fBanner 프로젝트 루트에서
cp -r _public/agents/claude/.claude-plugin .claude-plugin
cp -r _public/agents/claude/skills .claude/skills
```

### 방법 3: 심볼릭 링크
```bash
ln -sf _public/agents/claude/skills/fbanner .claude/skills/fbanner
```

## 6.2. 사용법

### 명령어 구조
```
/fbanner:fbanner [command] [path] [--options]
```

### 지원 명령어

| 명령어 | 동작 |
|--------|------|
| `split` | 원스텝 분할 (로드 + 설정 + 내보내기) |
| `load` | 파일 로드 |
| `config` | 분할 설정 변경 |
| `export` | 내보내기 실행 |
| `status` | 앱 상태 조회 |

### 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--rows=<N>` | 세로 분할 수 | `2` |
| `--cols=<N>` | 가로 분할 수 | `2` |
| `--format=<fmt>` | 출력 형식 (`bitmap`, `jpg`, `svg`, `pdf`) | `bitmap` |
| `--output=<dir>` | 출력 디렉토리 | `/tmp/fbanner-output` |
| `--ratio-w=<N>` | 가로 비율 | `1.0` |
| `--ratio-h=<N>` | 세로 비율 | `1.0` |
| `--server=<url>` | 서버 주소 변경 | `http://localhost:3011` |

### 사용 예시

```
/fbanner:fbanner split /tmp/banner.png --rows=3 --cols=4
/fbanner:fbanner split /tmp/document.pdf --rows=2 --cols=2 --format=svg --output=/tmp/tiles
/fbanner:fbanner load /tmp/image.png
/fbanner:fbanner config --rows=2 --cols=3 --format=svg
/fbanner:fbanner export /tmp/output
/fbanner:fbanner status
```

## 6.3. 전제 조건
- fBanner.app이 실행 중이고 설정에서 REST API가 활성화되어 있어야 합니다.
- 서버가 미응답 시 Skill이 앱 실행 안내 메시지를 자동으로 표시합니다.

## 6.4. 플러그인 구조
```
_public/agents/claude/
├── .claude-plugin/
│   └── plugin.json          # 플러그인 매니페스트
├── skills/
│   └── fbanner/
│       └── SKILL.md         # 이미지 그리드 분할 스킬 정의
└── README.md                # 플러그인 설치 및 사용 안내
```

---

# 7. MCP 서버 (Model Context Protocol)

fBanner REST API를 [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) 도구로 제공하는 서버입니다. Claude Desktop, Claude Code 등 MCP 호환 AI 에이전트에서 이미지 분할을 직접 수행할 수 있습니다.

## 7.1. 전제 조건
fBanner REST API 서버가 실행 중이어야 합니다:
- fBanner.app 실행 후 설정에서 REST API를 활성화
- 기본 서버 주소: `http://localhost:3011`

## 7.2. 설치

### 방법 1: npx (설치 없이 바로 실행)
별도 설치 없이 MCP 설정에서 `npx`로 직접 실행합니다.

### 방법 2: 글로벌 설치
```bash
npm install -g fbanner-mcp
```

### 방법 3: 소스에서 직접 실행
```bash
git clone https://github.com/nowage/fBanner.git
cd fBanner/_public/mcp
npm install
```

## 7.3. 설정

### Claude Code 설정
`~/.claude/settings.json` 또는 프로젝트 `.claude/settings.json`에 추가:

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

### Claude Desktop 설정
`~/Library/Application Support/Claude/claude_desktop_config.json`에 추가:

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

### 서버 주소 변경
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

### 소스 직접 실행 시
```json
{
  "mcpServers": {
    "fbanner": {
      "command": "node",
      "args": ["<프로젝트경로>/_public/mcp/index.js"]
    }
  }
}
```

## 7.4. 제공 도구 (Tools)

### `health_check` — 서버 상태 확인
fBanner 서버가 동작 중인지 확인합니다. 파라미터 없음.

### `split_image` — 이미지 분할
파일을 로드하고 그리드로 분할하여 내보냅니다.

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `path` | string | 예 | - | 입력 파일 절대 경로 |
| `output_dir` | string | 예 | - | 출력 디렉토리 경로 |
| `rows` | int | 아니오 | `2` | 세로 분할 수 |
| `cols` | int | 아니오 | `2` | 가로 분할 수 |
| `export_format` | string | 아니오 | `bitmap` | 출력 형식 |

### `get_status` — 앱 상태 조회
현재 로드된 파일, 분할 설정, 내보내기 상태를 조회합니다.

### `update_config` — 분할 설정 변경
분할 설정을 부분적으로 업데이트합니다.

## 7.5. 아키텍처

```
Claude Code / Claude Desktop
    │
    │ MCP (stdio)
    ▼
fbanner-mcp (MCP 서버)
    │
    │ HTTP (REST API)
    ▼
fBanner.app (localhost:3011)
```

## 7.6. 디버깅

### MCP Inspector로 테스트
```bash
npx @modelcontextprotocol/inspector npx fbanner-mcp
```

### 서버 연결 확인
```bash
curl http://localhost:3011/
```
