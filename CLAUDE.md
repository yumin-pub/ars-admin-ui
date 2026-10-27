# ARS Admin UI System

React 19 + TypeScript + SCSS로 만드는 관리자 UI 시스템. Storybook으로 사용 기준을 문서화한다.
설계 원칙은 `src/stories/introduction/Design Principles.mdx`, 구조는 `Project Structure.mdx`를 따른다.

## 명령어

슬래시 명령: `/new-component <Name>` (새 컴포넌트 추가 + 등록 누락 검증, `.claude/commands/`)

자동 검사(hook): Claude가 파일을 수정할 때마다 `.claude/hooks/check.mjs`가 돈다.
`.ts/.tsx`는 타입체크 + 린트, `.scss`는 Sass 컴파일을 검사하고, 실패하면 오류를 Claude에게 돌려줘 스스로 고치게 한다. (설정: `.claude/settings.json`)

```bash
npm run dev              # Vite 개발 서버 (/ui/* 경로에 컴포넌트별 데모 페이지)
npm run storybook        # Storybook (:6006)
npm run build            # tsc -b && vite build
npm run lint             # eslint .
npx tsc -b               # 타입체크만
```

## 작업 완료 조건 (이게 모두 통과해야 "끝")

1. `npx tsc -b` 에러 0
2. `npm run lint` 에러 0
3. `npm run build` 성공
4. 스타일·동작을 바꿨다면 Storybook 또는 `/ui/<name>` 페이지에서 직접 확인
5. 접근성 관련 변경은 동작을 실제로 검증 (키보드, 포커스, aria). "되는 것 같다"로 끝내지 않는다.

AI가 만든 코드도 위 조건을 통과하기 전에는 신뢰하지 않는다.

## 핵심 원칙

- 사용자에게 하는 모든 답변·계획·보고는 한국어로 쓴다. 코드와 식별자는 영어를 유지한다.
- **Core UI First**: Design Token → SCSS → HTML → React 순서. React 컴포넌트는 HTML 클래스를 재사용하는 얇은 Wrapper다.
  스타일 로직을 React 안에 따로 만들지 않는다.
- **토큰만 사용**: 색상, 간격, radius, 타이포, z-index, shadow를 하드코딩하지 않는다.
  `src/styles/tokens/`의 변수(`$primary`, `$space-4`, `$radius-md`, `$z-modal` 등)를 쓴다.
- **재사용 우선**: 새 컴포넌트를 만들기 전에 기존 컴포넌트를 먼저 확인한다.

## 네이밍

- 클래스는 `ui-` 접두사 + BEM: `ui-modal`, `ui-modal__panel`, `ui-modal__panel--sm`
- 상태 클래스는 `is-open`, `is-disabled`, `is-selected` 형태
- 컴포넌트 파일은 PascalCase, 각 컴포넌트 폴더는 아래 구조를 유지한다.

```txt
src/components/Button/
├── Button.tsx
├── Button.types.ts     # Props 타입. HTML 기본 속성이 필요하면 상속
└── index.ts            # export { default as Button } + 타입 export
```

## 컴포넌트 하나를 추가할 때 건드려야 하는 곳 (하나라도 빠지면 버그)

1. `src/components/<Name>/` : tsx, types, index
2. `src/styles/components/_<name>.scss` 작성 **그리고 `src/styles/components/_index.scss`에 `@use` 추가**
   (등록을 빼먹으면 스타일이 아예 안 먹는다. 과거에 Loading이 이 목록에서 빠져 있었다.)
3. `src/stories/components/<Name>/<Name>.stories.tsx` : Playground, Examples
4. `src/stories/components/<Name>/<Name>.mdx` : Overview, Props, States, Accessibility
5. `src/pages/UISystem/<Name>Page.tsx` + `src/routes/router.tsx` 경로 추가 (HTML 클래스 예제와 React 예제 병행)
6. `README.md` 컴포넌트 목록과 상태 표
7. `src/stories/introduction/Welcome.mdx`, `Project Structure.mdx`의 컴포넌트 목록

`/new-component <Name>` 명령이 위 목록을 순서대로 처리하고, 마지막에 누락 여부를 체크리스트로 보고한다.

SCSS 파일을 새로 만들 때는 **다른 파일을 복사한 뒤 내용을 바꾸지 않은 채 두지 않는다.**
클래스 접두사(`.ui-<name>`)가 파일 이름과 일치하는지 확인한다.

## 접근성 기준

- 인터랙티브 요소는 키보드만으로 조작 가능해야 한다 (Tab, Shift+Tab, Enter, Space, ESC, 방향키).
- 포커스 표시를 제거하지 않는다. `:focus-visible` 스타일을 둔다.
- 대화상자류는 `role`, `aria-modal`, `aria-labelledby`, 포커스 이동·복귀·트랩, 스크롤 잠금을 갖춘다. (`Modal`이 기준 구현)
- 폼 요소는 `label`과 연결하고, 오류는 `aria-invalid` / `aria-describedby`로 연결한다.
- `prefers-reduced-motion`을 존중한다.
- Storybook의 a11y 애드온에서 위반이 없어야 한다.

## 알려진 불일치 (건드리기 전에 확인)

- `src/components/Radio/`만 파일명이 소문자(`radio.tsx`, `radio.types.ts`)다. 다른 컴포넌트와 다르다.
- 문서 예제에 `@/components/...` import가 있지만 tsconfig에 `@` alias는 없다. 실제 코드는 상대 경로를 쓴다.
- `Project Structure.mdx`에 있는 `hooks`, `layouts`, `services` 디렉터리는 아직 없다.
- 단위 테스트는 `npm test`(= `vitest run --project unit`)로 돈다. `src/**/*.test.{ts,tsx}`를 node 환경에서 실행하며 브라우저가 필요 없다.
  `vite.config.ts`의 다른 프로젝트(`storybook`, `@storybook/addon-vitest`)는 Chromium(Playwright) 설치가 필요하고 `npm test`에는 포함되지 않는다.

## 하지 말 것

- 토큰 대신 색상·px 값 직접 입력
- 화면별 일회성 스타일을 공통 컴포넌트 SCSS에 섞기
- 상위 요소에 종속되는 깊은 네스팅 (요소 단위로 독립 사용 가능해야 한다)
- 검증 없이 "완료"라고 보고하기
