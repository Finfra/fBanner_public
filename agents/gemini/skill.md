# fBanner Gemini Skills

## 스킬(Skills)이란?

**스킬(Skills)**은 특정한 절차적 지식, 도구 연동, 도메인 전문성을 Gemini CLI에 부여하는 모듈화된 단일 목적 도구 패키지입니다. fBanner 프로젝트에서는 주로 `.agent/skills/` 디렉토리에 정의되어 있습니다 (예: `build-doctor`, `capture`, `issue-manager`).

## 스킬 디렉토리 구조

각 스킬은 해당 스킬의 이름으로 된 독립된 폴더를 갖습니다.

```
.agent/skills/skill-name/
├── SKILL.md (필수)
│   ├── YAML 메타데이터 (name, description 포함)
│   └── 마크다운 기반의 명령어 및 실행 지침
└── scripts/ (선택)
    └── 스킬 실행에 필요한 스크립트 파일 (Bash, Node.js, Python 등)
```

### SKILL.md (필수 구성 요소)

모든 스킬은 최상단에 `SKILL.md`를 포함해야 하며, `YAML` 프론트매터(Frontmatter)로 시작합니다. `name`과 `description`은 Gemini CLI가 언제 해당 스킬을 호출할지 판단하는 유일한 기준이므로 매우 구체적으로 작성해야 합니다.

```markdown
---
name: my-sample-skill
description: 이 스킬은 JSON 파일을 파싱하여 특정 값을 추출해야 할 때 사용합니다.
---

# My Sample Skill

## 실행 지침
이 스킬이 호출되면 다음 지침에 따라 작업을 수행하세요.
1. `scripts/parse.cjs` 파일을 실행하여 분석 결과를 도출합니다.
2. 에러가 발생한 경우 사용자에게 즉시 보고하고, 성공한 경우 결과를 마크다운 형태로 요약합니다.
```

## 스킬 생성 및 관리 (Skill Creator)

새로운 스킬을 생성하려면 Gemini CLI의 `skill-creator`를 활용하거나 다음 절차를 따를 수 있습니다.

1. `.agent/skills/` 하위에 새로운 스킬 이름의 폴더를 생성합니다.
2. `SKILL.md` 파일을 작성하고 목적과 트리거 조건을 `description`에 명시합니다.
3. (선택 사항) 반복적으로 사용하는 복잡한 셸 스크립트나 코드가 있다면 `scripts/` 디렉토리를 만들어 함께 번들링합니다.

## 로컬 스킬 설치 및 갱신

새로 작성하거나 업데이트한 스킬을 적용하려면 터미널에서 다음 명령어를 실행하여 설치할 수 있습니다.

```bash
gemini skills install .agent/skills/my-sample-skill --scope workspace
```

설치 후 Gemini CLI 대화창에서 `/skills reload`를 입력하여 에이전트의 컨텍스트를 갱신해야 반영됩니다.
