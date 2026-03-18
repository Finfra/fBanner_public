# 용어 사전 (Glossary)

이 문서는 fBanner 프로젝트 내의 주요 용어와 다국어(8개 언어) 번역을 정리한 문서입니다. 개발 규칙, 매뉴얼 작성, UI 라벨링 시 이 용어를 기준으로 합니다.

| 설명(개발용)                                  | English        | Korean             | Japanese       | Simplified Chinese | Traditional Chinese | Spanish                | French               | German             |
| :-------------------------------------------- | :------------- | :----------------- | :------------- | :----------------- | :------------------ | :--------------------- | :------------------- | :----------------- |
| **fBanner 앱 이름**                           | fBanner        | fBanner            | fBanner        | fBanner            | fBanner             | fBanner                | fBanner              | fBanner            |
| **미리보기 시각화 영역**                      | MiniMap        | 미니맵             | ミニマップ     | 迷你地图           | 迷你地圖            | Minimapa               | Mini-carte           | Minimap            |
| **분할할 가로(수직 절취) 구획**               | Columns (Col)  | 열(가로)           | 列             | 列                 | 列                  | Columnas               | Colonnes             | Spalten            |
| **분할할 세로(수평 절취) 구획**               | Rows (Row)     | 행(세로)           | 行             | 行                 | 行                  | Filas                  | Rangées              | Zeilen             |
| **불균등 분할 가중치 비율**                   | Ratio          | 분할 비율          | 割合           | 比例               | 比例                | Proporción             | Proportion           | Verhältnis         |
| **결과물 파일 포맷**                          | Export Format  | 출력 형식          | 出力形式       | 导出格式           | 輸出格式            | Formato de Exportación | Format d'exportation | Exportformat       |
| **이미지나 문서를 자르는 행위**               | Split          | 분할               | 分割           | 分割               | 分割                | Dividir                | Diviser              | Teilen             |
| **디스크 시스템에 분할 파일을 저장하는 액션** | Export         | 내보내기           | エクスポート   | 导出               | 导出                | Exportar               | Exporter             | Exportieren        |
| **작업 이력 및 썸네일 복원 탭**               | History        | 작업 히스토리      | 履歴           | 历史               | 歷史                | Historial              | Historique           | Verlauf            |
| **원본 이미지 가로 세로 스케일 비율**         | Aspect Ratio   | 이미지 비율        | アスペクト比   | 宽高比             | 寬高比              | Relación de aspecto    | Rapport d'aspect     | Seitenverhältnis   |
| **설정창 톱니바퀴**                           | Settings       | 설정               | 設定           | 设置               | 設定                | Configuración          | Paramètres           | Einstellungen      |
| **드래그앤드롭 입력 존**                      | Drop Zone      | 드롭 존            | ドロップゾーン | 放置区             | 放置區              | Zona de caída          | Zone de dépôt        | Ablagebereich      |
| **Base64 데이터 끼워넣기 (SVG)**              | Embedded Data  | 임베딩 데이터      | 埋め込みデータ | 嵌入数据           | 嵌入數據            | Datos Incrustados      | Données embarquées   | Eingebettete Daten |
| **손상되거나 에러난 형식**                    | Invalid Format | 지원하지 않는 형식 | 未対応の形式   | 不支持的格式       | 不支援的格式        | Formato no válido      | Format non valide    | Ungültiges Format  |

## REST API / 자동화 관련 용어

| 설명(개발용)                                                | English                    | Korean                       |
| :---------------------------------------------------------- | :------------------------- | :--------------------------- |
| **macOS 앱 내장 HTTP REST API 서버**                        | REST API Server            | 내장 API 서버                |
| **Apple Network.framework 기반 네트워크 리스너**            | NWListener                 | 네트워크 리스너              |
| **네트워크 접근을 제어하기 위한 IP 주소 범위 표기법**       | CIDR                       | 접근 제어 범위 (CIDR)        |
| **서버가 정상 동작 중인지 확인하는 간단한 요청**            | Health Check               | 헬스 체크                    |
| **API 요청을 받는 통신 접속 지점**                          | Endpoint                   | 엔드포인트                   |
| **API 요청 시 전달되는 핵심 데이터**                        | Payload                    | 페이로드                     |
| **파일 로드/설정/내보내기를 한 번에 처리하는 통합 요청**     | One-step Split             | 원스텝 분할                  |
| **AI 에이전트를 위한 표준 도구 제공 프로토콜**              | MCP (Model Context Protocol) | 모델 컨텍스트 프로토콜 (MCP) |
| **Claude Code에서 사용 가능한 커스텀 슬래시 명령어**        | Claude Code Skill          | Claude Code 스킬             |
| **MCP 서버를 호출하는 AI 에이전트 측**                      | MCP Client                 | MCP 클라이언트               |
| **표준 입출력(stdin/stdout) 기반 MCP 통신 방식**            | stdio Transport            | stdio 전송 방식              |
| **API 명세를 표준화하여 기술하는 규격**                     | OpenAPI Specification      | OpenAPI 명세                 |
| **API 서버 주소의 네트워크 포트 번호**                      | Port                       | 포트                         |
| **외부 네트워크에서의 API 접속 허용 여부**                  | External Access            | 외부 접속 허용               |
| **슬래시 커맨드를 제공하는 Claude Code 확장 패키지**         | Plugin                     | 플러그인                     |

> **참고**:
> * `Localizable.xcstrings` 기반의 실제 런타임 적용 시에도 이 표의 기준을 우선 준수합니다.
> * Source Code References: `ConfigPanelView.swift`, `MiniMapView.swift`, `SplitConfig.swift`, `RESTServer.swift`, `APISettingsView.swift`
