# Changelog

이 프로젝트의 주요 변경 사항을 기록합니다.
분류는 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/)의 Added·Changed·Fixed를, 버전은 [유의적 버전](https://semver.org/lang/ko/)을 따릅니다.
0.1.0 이후 항목은 release-please가 커밋 제목을 읽어 이 문서 맨 위에 자동으로 추가합니다. 직접 고치지 않습니다.
하위호환 기준과 커밋 제목 규칙은 Storybook의 `Introduction/Compatibility Policy` 문서(`src/stories/introduction/Compatibility Policy.mdx`)를 따릅니다.

## 0.1.0 (2026-10-27)

첫 기준선입니다. 저장소를 시작한 2026-06-11부터 지금까지의 변경을 한 덩어리로 정리했습니다. 이후 항목은 이 위에 쌓입니다.

### Added

- 초기 구현: Button, Radio, Checkbox, Select, Input, Modal, Table, Pagination, Badge, Loading 컴포넌트를 HTML 클래스(`ui-` BEM)와 React 래퍼로 제공합니다. 각 컴포넌트에 스토리, mdx 문서, `/ui/*` 데모 페이지가 있습니다.
- Input: 선택 prop `ref`를 추가했습니다. 실제 `<input>` 요소를 가리킵니다. (React 19의 일반 prop)
- Input: 선택 prop `helperTextId`를 추가했습니다. 지정하고 `helperText`가 있으면 메시지 요소에 id를 붙이고 input의 `aria-describedby`에 연결합니다. 넘긴 `aria-describedby`가 있으면 그 뒤에 잇습니다. 생략하면 DOM이 바뀌지 않습니다.
- Input: 선택 prop `onClear`를 추가했습니다. `clearable`의 지우기 버튼을 누르면(Enter·Space 포함) 호출합니다. 넘기지 않으면 버튼에 클릭 동작을 붙이지 않고, `disabled`·`readOnly`일 때는 호출하지 않습니다.
- Button: `color`에 선택 값 `'danger'`를 추가했습니다. `solid`와 `outline` 모두에서 쓸 수 있습니다. 기존 color의 이름·기본값·모양은 그대로입니다.
- Modal: 열리면 포커스를 모달 안으로 옮기고 Tab·Shift+Tab을 모달 안에서만 순환시키며, 닫히면 열기 전 포커스로 돌려줍니다. 열려 있는 동안 `body` 스크롤을 잠급니다. ESC와 딤 클릭으로 닫을 수 있고, 선택 prop `closeOnEsc`·`closeOnDimmed`(둘 다 기본 `true`)로 끌 수 있습니다.
- Modal: 선택 prop `role`(`'dialog' | 'alertdialog'`, 기본 `'dialog'`)과 `ariaDescribedBy`를 추가했습니다. 지정하지 않으면 기존 DOM과 같습니다. `ModalRole` 타입을 내보냅니다.
- Checkbox: 선택 prop `ref`의 타입을 추가했습니다. (일부 선택 상태 스타일은 아래 Changed 참고)
- Badge: `variant`에 `'tag'`를 추가했습니다. 상태가 아닌 분류(태그)용으로, 점 없이 테두리가 있는 사각형으로 표시합니다.
- Pagination: 선택 prop `ariaLabel`(기본 `'페이지네이션'`)을 추가했습니다. 한 화면에 Pagination이 여러 개일 때 `nav`를 구분합니다.
- Table: 선택 prop `selectedIds`를 추가했습니다. 포함된 id의 행에 `is-selected` 클래스를 붙입니다.
- Table: 선택 prop `ariaLabel`(표 이름), `caption`(보이는 표 제목), `refreshing`·`refreshingMessage`(현재 행을 둔 채 로딩 overlay를 덮고 table에 `aria-busy`를 줌)를 추가했습니다. 지정하지 않으면 해당 속성이나 요소를 만들지 않습니다.
- Loading: `index.ts` 내보내기, 스토리, mdx, `/ui/loading` 데모 페이지, 스타일 등록을 추가했습니다. `description` 타입으로 `null`을 허용합니다. (`null`은 원래도 보조 문구를 숨겼습니다)
- 토큰: 흰 배경·연한 배경 위 글자용 `$success-text`, `$warning-text`와 위험(danger) 버튼의 상태 색 `$error-pressed`, `$error-disabled`를 추가했습니다.

### Changed

- Pagination: 버튼에서 `disabled` 속성을 없앴습니다. 현재 페이지는 `aria-current="page"`와 `is-active`로, 이동할 수 없는 처음·이전·다음·마지막 버튼은 `aria-disabled`와 `is-disabled`로 표시합니다. 이때 `onPageChange`를 호출하지 않는 것은 이전과 같습니다. (이유: `disabled`가 되면 누른 버튼에서 키보드 포커스가 사라지기 때문)
  - 영향: `button:disabled`로 준 스타일이나 `toBeDisabled()` 같은 검증은 더 이상 맞지 않습니다. 이동할 수 없는 버튼과 현재 페이지 버튼이 Tab 순서에 들어옵니다.
- Pagination: 처음·마지막 페이지 바로가기 버튼의 접근 가능한 이름을 "1페이지로 이동"·"N페이지로 이동"에서 "페이지 1"·"페이지 N"으로 바꿨습니다. (이유: 화면에 보이는 숫자와 이름을 맞추기 위해) 이름으로 버튼을 찾던 테스트는 고쳐야 합니다.
- Button: 기본 `type`을 `'button'`으로 정했습니다. 이전에는 지정하지 않아, form 안에서 누르면 form이 제출됐습니다. 제출 버튼은 `type="submit"`을 명시합니다.
- Input: 크기 prop 이름을 `InputSize`에서 `size`로 바꿨습니다.
- Checkbox: 일부 선택 상태(`input.indeterminate = true`)를 가로줄로 표시하는 공통 스타일을 추가했습니다. checked와 함께여도 가로줄로, disabled이면 회색으로 보입니다. 선택 prop이 아니라 공통 CSS 변경이라, 이미 ref로 `indeterminate`를 주던 곳은 업데이트 후 모양이 바뀝니다. (이유: 일부 선택 상태가 화면에서 구분되지 않았기 때문)
- 모양: Input·Select의 라벨은 포커스·오류 상태에서도 기본 색을 유지하고, 성공 메시지 글자색은 대비 4.5:1 이상인 `$success-text`로 바꿨습니다. Table은 고정 레이아웃(`table-layout: fixed`)과 컬럼 너비를 씁니다. Modal 닫기 버튼과 Input 지우기 버튼에 `:focus-visible` 표시를 추가했습니다.

### Fixed

- Table: 컬럼의 `align`이 헤더뿐 아니라 본문 셀에도 적용되도록 고쳤습니다.
- Table: 같은 `dataIndex`를 쓰는 컬럼이 여러 개일 때 React key가 겹치던 문제를 고쳤습니다. (key에 컬럼 순서를 포함)
