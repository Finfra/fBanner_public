# fBanner 매뉴얼 개요 (Manual Structure Overview)

본 문서는 fBanner 사용자/개발자 매뉴얼의 상위 구조와 작성 가이드를 정의합니다. 실제 세부 문서는 본 구조에 따라 하위 패키지에 파일로 확장합니다.

## 목적과 범위
- 대상: 일반 사용자(파일 분할 사용법), 프로 유저(고급 분할 비율 및 PDF/SVG 다루기), 개발자(렌더링 엔진 및 아키텍처)
- 범위: 기능 개요 → 파일 분할 사용법 → 고급 내보내기 엔진 → 히스토리 관리 → FAQ/부록
- 규칙: 모든 링크는 리포지토리 루트 기준 상대 경로 사용, 한국어 우선 작성 후 `kr`/`en` 폴더로 배포 관리

## 디렉토리 구조(제안)
- 01_Overview/
  - Introduction.md: 제품 개요, 핵심 기능(Bitmap, SVG, PDF 분할 렌더링)
  - Architecture.md: 내부 분할 엔진 파이프라인(SplitCalculator, CoreGraphics)
    - 참조: `_doc_design/Spec.md`, `_doc_design/UI.md`, `_doc_design/Lib.md`
- 02_QuickStart/
  - QuickStart.md: 드래그앤드롭 → 비율 선택 → 내보내기 3단계 기본 사용법
- 03_UserGuide/
  - LoadingFiles.md: 지원되는 포맷과 파일 로드 방식(에러 케이스 포함)
  - ConfigPanel.md: 설정 패널 사용 가이드 (그리드 설정, 비율 가중치 비율, 출력 포맷)
  - MiniMap.md: 실시간 미니맵 뷰어 해석 방법
- 04_ExportEngine/
  - ExportFormat.md: PNG, PDF, SVG의 차이점 및 적절한 포맷 선택 가이드
  - SVG_Base64.md: SVG 내보내기 시 Base64 임베딩 원리 이해 (단일 파일 독립성)
- 05_Advanced/
  - History.md: 작업 내역 관리, 썸네일 리뷰, 원본 이미지 분할 설정(복원) 방법
  - Localization.md: 8개 국어 지원 및 UI 자동 언어 대응
- 06_REST_API/
  - REST_API.md: REST API 서버 사용법, 7개 엔드포인트 레퍼런스, 보안 정책(CIDR 접근 제어)
  - API_Examples.md: cURL 예제, 자동화 스크립트 활용법
    - 참조: `_public/api/openapi.yaml`
- 07_Automation/
  - ClaudeCodeSkill.md: Claude Code Skill 설치 및 사용법 (slash command 기반)
    - 참조: `_public/agents/claude/README.md`, `_public/agents/claude/skills/fbanner/SKILL.md`
  - MCP_Server.md: MCP(Model Context Protocol) 서버 설정 가이드 (Claude Desktop / Claude Code 연동)
    - 참조: `_public/mcp/`
- 08_FAQ_and_Troubleshooting/
  - Troubleshooting.md: 대용량 이미지 처리 한계, 권한 오류, PDF 페이지 분할 이슈, API 연결 오류
- 99_Appendix/
  - Glossary.md: 주요 용어 사전 다국어 매핑표

## 작성 가이드
- 파일/제목 규칙: 폴더별 주제 중심, 명사형 제목 사용 (예: LoadingFiles, History)
- 링크 정책: 문서 간 교차 참조는 상대 경로 사용
- 버전/변경 이력: Release 노트와 Issue.md 기준 주요 기능 반영

## 관련 문서(핵심 링크)
- 기획서 및 스펙: `_doc_design/Spec.md`, `_doc_design/UI.md`
- 이슈 현황: `Issue.md`
- 라이브러리 레포트: `_doc_work/lib-report.md`
- REST API 명세: `_public/api/openapi.yaml`
- Claude Code Skill: `_public/agents/claude/`
- MCP 서버: `_public/mcp/`

---
본 README는 매뉴얼 확장을 위한 청사진 역할을 합니다. 작성해야 할 리스트의 폴더를 구성하고 체크리스트를 관리하세요.
