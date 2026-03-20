# fBanner Gemini Workflows

## 워크플로우(Workflows)란?

Gemini CLI 환경에서 **워크플로우**는 하나 이상의 **스킬(Skill)**과 **규칙(Rules)**을 엮어 수행하는 복합 태스크입니다. fBanner 프로젝트에서는 주로 `.agent/workflows/` 디렉토리에 정의되어 있습니다. 
주로 `/deploy`, `/doc-work`, `/issue`, `/qa-type-do` 등 프로젝트 표준화 파이프라인 역할을 수행합니다.

## 워크플로우 구성 방법

워크플로우를 새로 작성하거나 변경할 때는 다음 가이드라인을 따르세요.

1. `.agent/workflows/` 폴더 내에 `.md` 형태의 파일로 저장합니다.
2. 특정 규칙을 가져오거나 스킬을 호출하는 방법은, 해당 스킬이나 규칙이 Gemini CLI 컨텍스트 상에 로드되어 있음을 가정하고, 명령어 형식으로 기술합니다.
3. Workflow 설계 시 고려사항:
   - 각 단계는 명확하고 구체적이어야 합니다.
   - 선행 작업과 후행 작업을 명시적으로 적어줍니다 (예: 배포 전 `build-doctor`와 테스트 검증 진행).
   - 한국어로 작성하는 것을 원칙으로 합니다. (프로젝트 룰에 의해)

### 워크플로우 예시 (workflow-example.md)

```markdown
# `/sample-workflow` 파이프라인

## 목표
주어진 기능을 테스트하고 배포 전 캡처 화면을 저장합니다.

## 단계 (Steps)
1. **분석**: `.agent/rules/coding-rules.md`를 참고하여 대상 파일의 코딩 규칙을 검증합니다.
2. **테스트**: `folder-test-runner` 스킬을 활용해 자동화 테스트를 수행합니다.
3. **결과 검증**: 테스트 결과에 이상이 없다면 `capture` 스킬을 사용하여 주요 화면을 스크린샷으로 기록합니다.
4. **마무리**: 결과를 `Issue.md`의 Save Point에 기록합니다 (`save-point-update` 스킬 활용).
```

## 워크플로우 실행 방법

보통 사용자가 Gemini CLI의 채팅 인터페이스를 통해 명령(`... /sample-workflow 실행해줘`)을 입력하면, 에이전트가 해당 워크플로우 문서(.md)의 지시를 따라 작업을 단계별로 수행합니다.
