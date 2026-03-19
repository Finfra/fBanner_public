# fBanner REST API 문서

## 개요

fBanner는 이미지/PDF/SVG 파일을 Row x Col 그리드로 분리하여 내보내는 macOS 앱입니다. REST API를 통해 파일 로드, 분할 설정, 내보내기 기능을 자동화할 수 있습니다.

| 서버 구현 | 기술 스택 | 기본 포트 |
|-----------|-----------|-----------|
| macOS 네이티브 앱 | Swift / Network.framework (NWListener) | 3011 |

API 서버는 **기본적으로 비활성화** 상태이며, 설정에서 명시적으로 활성화해야 합니다.

> OpenAPI 3.0 스펙: [openapi.yaml](./openapi.yaml)

---

## 보안

- API 서버는 **기본적으로 비활성화** 상태이며, 설정에서 명시적으로 활성화해야 합니다.
- 기본적으로 **localhost (127.0.0.1)** 연결만 허용됩니다.
- 설정의 "외부 접근 허용" 체크박스를 통해 외부 접근을 활성화할 수 있으며, 허용할 IP 범위를 CIDR 형식(예: `192.168.0.0/24`)으로 지정할 수 있습니다.
- 허용된 CIDR 범위 밖의 IP에서 접속 시 연결이 즉시 거부(cancel)됩니다 (HTTP 응답 없음).
- localhost는 CIDR 설정과 관계없이 항상 허용됩니다.

---

## 엔드포인트

### 1. 서버 상태 확인

```
GET /
```

**응답**:
```json
{
  "status": "ok",
  "app": "fBanner",
  "version": "1.0",
  "port": 3011
}
```

---

### 2. 애플리케이션 상태 조회

```
GET /api/status
```

현재 애플리케이션 상태(로드된 파일 정보, 분할 설정, 내보내기 진행률)를 반환합니다.

**응답 예시** (파일 로드 상태):
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

### 3. 분할 설정 조회

```
GET /api/config
```

현재 그리드 분할 및 내보내기 설정을 반환합니다.

---

### 4. 분할 설정 변경

```
PUT /api/config
Content-Type: application/json
```

#### 요청 파라미터

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `rows` | integer | 아니오 | - | 세로 분할 수 (1~100) |
| `cols` | integer | 아니오 | - | 가로 분할 수 (1~100) |
| `ratioW` | number | 아니오 | - | 가로 비율 (0.1~10.0) |
| `ratioH` | number | 아니오 | - | 세로 비율 (0.1~10.0) |
| `exportFormat` | string | 아니오 | - | 출력 형식: `bitmap` (PNG), `jpg`, `svg`, `pdf` |
| `jpgQuality` | number | 아니오 | - | JPEG 품질 (0.1~1.0, exportFormat이 bitmap 또는 jpg일 때 적용) |
| `pdfExportMode` | string | 아니오 | - | PDF 내보내기 모드: `firstPage`, `allPages`, `selectedPage` |
| `selectedPdfPage` | integer | 아니오 | - | 선택된 PDF 페이지 번호 (pdfExportMode가 selectedPage일 때) |
| `exportNameTemplate` | string | 아니오 | - | 출력 파일명 템플릿 |

제공된 필드만 변경되며, 생략된 필드는 현재 값을 유지합니다.

#### 요청 예시

```json
{
  "rows": 3,
  "cols": 4,
  "exportFormat": "bitmap"
}
```

**에러**:

| 상태 코드 | 원인 | 응답 예시 |
|-----------|------|-----------|
| 400 | 잘못된 파라미터 값 | `{"success": false, "error": "Invalid parameter"}` |

---

### 5. 파일 로드

```
POST /api/load
Content-Type: application/json
```

#### 요청 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `path` | string | 예 | 입력 파일의 절대 경로 |

#### 지원 형식

PNG, JPG, JPEG, TIFF, BMP, GIF, PDF, SVG

#### 요청 예시

```json
{
  "path": "/path/to/banner.png"
}
```

#### 응답

**성공 (200)**:
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

**에러**:

| 상태 코드 | 원인 | 응답 예시 |
|-----------|------|-----------|
| 400 | 지원하지 않는 형식 또는 잘못된 경로 | `{"success": false, "error": "Unsupported file format. (PNG, JPG, TIFF, BMP, GIF, PDF, SVG)"}` |

---

### 6. 내보내기

```
POST /api/export
Content-Type: application/json
```

현재 로드된 파일을 그리드 분할하여 지정된 디렉토리에 내보냅니다. `/api/load`로 파일을 먼저 로드해야 합니다.

#### 요청 파라미터

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `outputDir` | string | 예 | 출력 디렉토리의 절대 경로 |

#### 요청 예시

```json
{
  "outputDir": "/path/to/output"
}
```

#### 응답

**성공 (200)**:
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

**에러**:

| 상태 코드 | 원인 | 응답 예시 |
|-----------|------|-----------|
| 409 | 파일 미로드 | `{"success": false, "error": "No file loaded. Load a file first via /api/load."}` |

---

### 7. 원스텝 분할 (로드 + 설정 + 내보내기)

```
POST /api/split
Content-Type: application/json
```

파일 로드, 설정 변경, 내보내기를 한 번의 요청으로 수행합니다. **자동화 스크립트에 권장되는 엔드포인트입니다.**

#### 요청 파라미터

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `path` | string | 예 | - | 입력 파일의 절대 경로 |
| `outputDir` | string | 예 | - | 출력 디렉토리의 절대 경로 |
| `rows` | integer | 아니오 | 2 | 세로 분할 수 (1~100) |
| `cols` | integer | 아니오 | 2 | 가로 분할 수 (1~100) |
| `ratioW` | number | 아니오 | 1.0 | 가로 비율 (0.1~10.0) |
| `ratioH` | number | 아니오 | 1.0 | 세로 비율 (0.1~10.0) |
| `exportFormat` | string | 아니오 | `bitmap` | 출력 형식: `bitmap` (PNG), `jpg`, `svg`, `pdf` |
| `jpgQuality` | number | 아니오 | 0.8 | JPEG 품질 (0.1~1.0) |
| `exportNameTemplate` | string | 아니오 | `{name}_{rr}-{cc}` | 출력 파일명 템플릿 |

#### 요청 예시

```json
{
  "path": "_public/resource/contents/example1.png",
  "outputDir": "_public/resource/contents_result",
  "rows": 3,
  "cols": 4,
  "exportFormat": "bitmap"
}
```

**에러**:

| 상태 코드 | 원인 | 응답 예시 |
|-----------|------|-----------|
| 400 | 잘못된 파라미터 또는 지원하지 않는 형식 | `{"success": false, "error": "..."}` |

---

## 사용 예시

### cURL

```bash
# 서버 상태 확인
curl http://localhost:3011/

# 파일 로드
curl -X POST http://localhost:3011/api/load \
  -H "Content-Type: application/json" \
  -d '{"path": "_public/resource/contents/example1.png"}'

# 분할 설정 변경
curl -X PUT http://localhost:3011/api/config \
  -H "Content-Type: application/json" \
  -d '{"rows": 3, "cols": 4}'

# 내보내기
curl -X POST http://localhost:3011/api/export \
  -H "Content-Type: application/json" \
  -d '{"outputDir": "_public/resource/contents_result"}'

# 원스텝 분할 (권장)
curl -X POST http://localhost:3011/api/split \
  -H "Content-Type: application/json" \
  -d '{"path": "_public/resource/contents/example1.png", "outputDir": "_public/resource/contents_result", "rows": 2, "cols": 3}'

# 현재 상태 조회
curl http://localhost:3011/api/status

# 현재 설정 조회
curl http://localhost:3011/api/config
```

### Python

```python
import requests

BASE_URL = 'http://localhost:3011'

# 원스텝 분할
response = requests.post(
    f'{BASE_URL}/api/split',
    json={
        'path': '_public/resource/contents/example1.png',
        'outputDir': '_public/resource/contents_result',
        'rows': 2,
        'cols': 3,
        'exportFormat': 'bitmap'
    }
)

result = response.json()
print(f"내보낸 파일 수: {result['data']['fileCount']}")
print(f"파일 목록: {result['data']['files']}")
```

---

## 분할 설정 옵션

| 옵션 | 설명 | 범위 | 기본값 |
|------|------|------|--------|
| rows | 세로 분할 수 | 1~100 | 2 |
| cols | 가로 분할 수 | 1~100 | 2 |
| ratioW | 가로 비율 | 0.1~10.0 | 1.0 |
| ratioH | 세로 비율 | 0.1~10.0 | 1.0 |
| exportFormat | 출력 형식 | bitmap (PNG), jpg, svg, pdf | bitmap |
| jpgQuality | JPEG 품질 | 0.1~1.0 | 0.8 |
| exportNameTemplate | 파일명 템플릿 | - | `{name}_{rr}-{cc}` |

### 파일명 템플릿 플레이스홀더

| 플레이스홀더 | 설명 | 예시 |
|-------------|------|------|
| `{name}` | 원본 파일명 (확장자 제외) | banner |
| `{rr}` | 행 번호 (zero-padded) | 01 |
| `{cc}` | 열 번호 (zero-padded) | 02 |

출력 예시: `banner_01-02.png`

---

## 테스트

```bash
# 자동화 테스트 (기본: localhost:3011)
bash _public/api/test-api.sh

# 원격 서버 테스트
bash _public/api/test-api.sh --server=http://192.168.0.10:3011
```

테스트 항목:
1. 헬스 체크 (GET `/`) 및 응답 검증
2. 애플리케이션 상태 조회 (GET `/api/status`)
3. 분할 설정 조회 (GET `/api/config`)
4. 분할 설정 변경 (PUT `/api/config`)
5. 잘못된 경로로 파일 로드 시 400 응답
6. 파일 미로드 상태에서 내보내기 시 409 응답
7. 404 Not Found 응답 처리
8. 파일 로드 + 내보내기 통합 테스트 (`resource/` 이미지 필요)
9. 원스텝 분할 (2x2 그리드) 통합 테스트
