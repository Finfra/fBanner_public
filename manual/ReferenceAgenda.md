# fBanner 사용자 매뉴얼 참조 (Reference Agenda)

## 1. 앱 개요 및 파일 입력 (Overview & Input)
### 1-1. 지원 파일 포맷 (Supported Formats: PNG, JPEG, SVG, PDF)
### 1-2. 드래그 앤 드롭 미디어 로드 (Drag & Drop Zone)
### 1-3. 파일 메타데이터 추출 및 에러 처리 (Metadata & Error Handling)

## 2. 분할 설정 및 미니맵 (Split Configuration & MiniMap)
### 2-1. 행(Row)과 열(Col) 기반 분할 설정
### 2-2. 불균등 비율 분할 곡선 및 가중치 (Ratio Configuration)
### 2-3. 이미지 가로/세로 원본 비율 조정 (Image Aspect Ratio)
### 2-4. 미니맵 실시간 시각화 및 그리드 인디케이터 (Real-time Preview)

## 3. 고품질 내보내기 엔진 (Export Engine)
### 3-1. Bitmap (PNG) 내보내기 작동 방식
### 3-2. PDF 분할 및 페이지 렌더링 엔진 (CoreGraphics)
### 3-3. SVG 내보내기 (Base64 PNG 임베딩 기반)
### 3-4. 대용량 해상도 메모리 관리 및 병렬 처리

## 4. 고급 기능 및 설정 (Advanced Features)
### 4-1. 작업 히스토리 조회 및 설정 복원 (History Management)
### 4-2. 다국어 지원 (Localization - 8개 국어)
### 4-3. 단축키 및 환경 설정 (Shortcuts & Global Settings)

## 5. 내장 REST API 서버 (Built-in REST API Server)
### 5-1. 서버 아키텍처 (NWListener 기반 경량 HTTP 서버)
### 5-2. 보안 정책 (localhost 기본, CIDR 기반 외부 접속 제어)
### 5-3. API 엔드포인트 레퍼런스 (7개)
- `GET /` — 헬스 체크 (서버 상태, 앱 이름, 버전, 포트)
- `GET /api/status` — 앱 상태 조회 (로드된 파일 정보, 설정, 진행률)
- `GET /api/config` — 현재 분리 설정 조회
- `PUT /api/config` — 분리 설정 변경 (부분 업데이트, UI 실시간 반영)
- `POST /api/load` — 파일 로드 (PNG, JPG, TIFF, BMP, GIF, PDF, SVG)
- `POST /api/export` — 내보내기 실행 (지정 디렉토리에 분할 파일 저장)
- `POST /api/split` — 원스텝 분할 (로드 + 설정 + 내보내기 통합)
### 5-4. 설정 필드 레퍼런스 (rows, cols, ratioW, ratioH, exportFormat 등)
### 5-5. cURL 사용 예시 및 자동화 스크립트 활용
### 5-6. 에러 응답 코드 (400, 404, 409, 500)
### 5-7. API 설정 화면 (포트, 활성화, 외부 접속, CIDR 관리)

## 6. Claude Code Skill (자동화 연동)
### 6-1. 설치 방법 (플러그인 설치, 수동 복사, 심볼릭 링크)
### 6-2. 명령어 구조 및 사용법
- `split` — 원스텝 분할
- `load` — 파일 로드
- `config` — 설정 변경
- `export` — 내보내기
- `status` — 상태 조회
### 6-3. 옵션 레퍼런스 (--rows, --cols, --format, --output, --ratio-w, --ratio-h, --server)
### 6-4. 플러그인 구조 (.claude-plugin, skills)

## 7. MCP 서버 (Model Context Protocol)
### 7-1. 전제 조건 (fBanner REST API 서버 실행 필요)
### 7-2. 설치 방법 (npx, 글로벌 설치, 소스 빌드)
### 7-3. 설정 (Claude Code, Claude Desktop)
### 7-4. 제공 도구 (health_check, split_image, get_status, update_config)
### 7-5. 아키텍처 (Claude → MCP stdio → HTTP REST → fBanner.app)
### 7-6. 디버깅 (MCP Inspector, 서버 연결 확인)
