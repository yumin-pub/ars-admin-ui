---
description: 새 UI 컴포넌트를 프로젝트 규칙에 맞게 추가하고, 등록 누락이 없는지 검증한다
argument-hint: <ComponentName> [설명]
---

새 컴포넌트 `$ARGUMENTS` 를 추가한다. 먼저 루트의 `CLAUDE.md` 를 읽고 그 규칙을 따른다.
이 명령의 목적은 **"컴포넌트 추가 시 건드릴 곳" 을 하나도 빠뜨리지 않는 것**이다.

## 0. 시작 전 확인 (코드를 쓰기 전에)

1. 이름이 PascalCase 인지 확인한다. 아니면 멈추고 제안한다.
2. `src/components/` 에 같은 이름이나 비슷한 역할의 컴포넌트가 이미 있는지 본다.
   있으면 새로 만들지 말고 확장할지 사용자에게 묻는다. (재사용 우선)
3. 컴포넌트의 역할, props, 상태(default / hover / disabled / error 등), 키보드 조작 여부를
   3~5줄로 정리해 사용자에게 보여주고, 모호한 부분이 있을 때만 질문한다.

## 1. 기준으로 삼을 파일

- 구조와 네이밍: `src/components/Pagination/` (tsx, types, index)
- 접근성이 중요한 동작(포커스, ESC, aria): `src/components/Modal/Modal.tsx`
- 스타일 토큰 사용 방식: `src/styles/components/_table.scss`
- 스토리와 문서: `src/stories/components/Table/` (Playground, Examples, mdx)
- 데모 페이지: `src/pages/UISystem/TablePage.tsx`

다른 컴포넌트를 복사해 시작하되, **복사한 이름·클래스 접두사를 반드시 바꾼다.**

## 2. 만들거나 고칠 파일 (6곳 + 등록처)

| # | 위치 | 할 일 |
| --- | --- | --- |
| 1 | `src/components/<Name>/` | `<Name>.tsx`, `<Name>.types.ts`, `index.ts` (Radio만 소문자 예외, 새 컴포넌트는 PascalCase) |
| 2 | `src/styles/components/_<name>.scss` | `.ui-<name>` BEM, 토큰만 사용, `:focus-visible` 포함 |
| 3 | `src/styles/components/_index.scss` | `@use './<name>';` 추가 (**빠뜨리면 스타일이 안 먹는다**) |
| 4 | `src/stories/components/<Name>/<Name>.stories.tsx` | Playground, Examples. `useArgs` 는 `render` 함수 안에서만 호출 |
| 5 | `src/stories/components/<Name>/<Name>.mdx` | Overview, Props, States, Accessibility |
| 6 | `src/pages/UISystem/<Name>Page.tsx` + `src/routes/router.tsx` | `/ui/<name>` 경로, HTML 클래스 예제와 React 예제 병행 |
| 7 | `README.md` | 컴포넌트 목록, 상태 표 |
| 8 | `src/stories/introduction/Welcome.mdx`, `Project Structure.mdx` | 컴포넌트 목록에 추가 |

## 3. 작성 규칙 (CLAUDE.md 요약)

- 색상·간격·radius·z-index·shadow 하드코딩 금지. `src/styles/tokens/` 변수만 쓴다.
- 클래스는 `ui-` 접두사 + BEM, 상태는 `is-*`. 상위 요소에 종속되는 깊은 네스팅 금지.
- React 컴포넌트는 HTML 클래스를 재사용하는 얇은 래퍼다. 스타일 로직을 React에 넣지 않는다.
- 폼 요소는 `label` 연결, 오류는 `aria-invalid` / `aria-describedby`.
- 같은 종류의 컴포넌트가 둘 이상 한 화면에 올 수 있으면 이름(`aria-label`)으로 구분할 수 있게 한다.

## 4. 검증 (모두 통과해야 "끝")

1. `npx tsc -b` 에러 0
2. `npm run lint` 에러 0
3. `npm run build` 성공
4. 위 3~7번 등록처를 `grep` 으로 다시 확인한다. (`@use './<name>'`, 라우트, README, 목록)
5. SCSS를 `sass` 로 임시 컴파일해 에러가 없는지 확인하고, 컴파일 결과는 되돌린다.
   `src/css/common.css`, `main.css` 는 **사용자가 직접 컴파일**하므로 건드리지 않는다.
6. 가능하면 브라우저(Playwright)로 `/ui/<name>` 을 열어 axe 위반이 0 인지 확인한다.
   키보드 조작이 있는 컴포넌트는 Tab / Enter / Space / ESC 가 실제로 동작하는지 눈으로 확인한다.

"되는 것 같다"로 끝내지 않는다. 확인하지 못한 항목은 못 했다고 적는다.

## 5. 마지막에 보고할 형식

아래 체크리스트를 채워서 보여준다. 항목마다 한 줄이면 충분하다.

```text
[x] 1 컴포넌트 파일      [x] 2 SCSS        [x] 3 _index.scss 등록
[x] 4 스토리             [x] 5 mdx         [x] 6 데모 페이지 + 라우트
[x] 7 README             [x] 8 소개 문서
검증: tsc / lint / build / axe / 키보드  → 각각 결과
사용자가 할 일: SCSS 컴파일(common.css, main.css), 화면 확인, 커밋·푸시
```

## 하지 말 것

- `git commit`, `git push` 를 하지 않는다. 대신 영문 Conventional Commits 형식 메시지를 제안한다
  (예: `feat: add <Name> component with stories and docs`).
- 컴파일된 CSS(`src/css/*.css`)를 직접 수정하지 않는다.
- 요청하지 않은 기존 컴포넌트를 함께 고치지 않는다. 필요해 보이면 제안만 한다.
