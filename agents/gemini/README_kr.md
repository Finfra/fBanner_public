# fBanner Gemini Agent

## 개요

fBanner Gemini 에이전트는 Google의 Gemini CLI를 활용하여 통합된 개발 경험을 제공합니다. 이는 fBanner 프로젝트의 테스트 자동화, 빌드 분석, 배포, 설계 문서화 등을 담당하는 구체적인 **스킬(Skills)**, **워크플로우(Workflows)**, **규칙(Rules)**으로 구성되어 있습니다.

## 주요 구성요소

- **Skills (`.agent/skills/`)**: Gemini CLI의 기능을 확장하는 모듈형 단일 목적 도구 패키지입니다. `build-doctor`, `capture`, `issue-manager` 등이 있습니다.
- **Workflows (`.agent/workflows/`)**: `/deploy`, `/qa-type-do`, `/lib-apply` 같은 복합 태스크를 수행할 수 있도록 지시하는 단계별 절차 파이프라인 문서입니다.
- **Rules (`.agent/rules/`)**: 프로젝트 작업 시 반드시 지켜야 할 제약 사항과 가이드라인(예: `snippet_rules.md`, `language-rules.md`)을 정의합니다.

## 설치 및 설정 방법

이 프로젝트의 Gemini 스킬들은 `.agent/skills/`에 구성되어 있습니다. 사용 환경에 맞추어 `gemini skills install` 명령으로 작업 공간에 설치할 수 있습니다.

```bash
# 특정 스킬 설치 예시 (작업 공간 범위)
gemini skills install .agent/skills/build-doctor --scope workspace
```

설치 후 활성화된 Gemini CLI 세션에서 다음 명령어로 스킬을 다시 불러와야 합니다:
```
/skills reload
```

## 스킬 및 워크플로우 가이드

스킬 및 워크플로우에 대한 더 자세한 생성 방법이나 사용법은 아래 문서를 참고하세요:
- [워크플로우 사용 가이드(workflow.md)](workflow.md)
- [스킬 사용 가이드(skill.md)](skill.md)
