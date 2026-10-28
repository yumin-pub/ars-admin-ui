# ARS Admin UI System

React + TypeScript와 SCSS를 기반으로 구축한 관리자 UI 시스템입니다.

실무에서 반복적으로 사용되는 관리자 화면 요소를 재사용 가능한 컴포넌트로 구조화하고, Storybook을 통해 컴포넌트의 상태, 사용 방법, 실제 UI 예제를 문서화하는 것을 목표로 합니다.

---

## Project Overview

이 프로젝트는 웹 퍼블리싱 실무에서 반복적으로 구현했던 관리자 UI 패턴을 React 컴포넌트 구조로 확장하기 위해 시작했습니다.

HTML과 SCSS 기반의 UI 구조를 유지하면서 React와 TypeScript를 결합하여 다음 내용을 중점적으로 설계했습니다.

- 반복 사용 가능한 UI 컴포넌트 구조
- 컴포넌트별 상태 및 변형 관리
- TypeScript 기반 Props 정의
- SCSS 디자인 토큰 및 공통 스타일 구조
- Storybook 기반 컴포넌트 문서화
- React 사용 예제와 HTML 클래스 사용 예제 병행
- 관리자 화면에서 활용할 수 있는 실제 UI 예제 구성
- 접근성을 고려한 상태 및 인터랙션 설계

각 컴포넌트는 Storybook에서 독립적으로 확인할 수 있으며, Playground와 실제 페이지 예제를 통해 동작과 사용 방법을 함께 제공합니다.

---

## Project Goals

### UI System

현재 구현된 컴포넌트입니다.

- Badge
- Button
- Input
- Radio
- Checkbox
- Select
- Table
- Pagination
- Modal
- Loading

### Planned Components

추후 추가할 예정인 공통 상태 컴포넌트입니다.

- Empty State
- Error State

### Admin CRUD

추후 관리자 CRUD 예제를 통해 다음 기능을 구성할 예정입니다.

- 목록 조회
- 상세 조회
- 등록
- 수정
- 삭제
- Mock API 연동
- 서버 상태 관리

#### 게시글 변경분 (overlay)

DummyJSON은 추가·수정·삭제 요청을 받아도 저장하지 않습니다. 그래서 서버 원본(TanStack Query 목록)과 내 변경분을 나눠 두고, 화면에는 합쳐서 보여줍니다. 실제 서버를 쓰게 되면 이 층만 걷어내면 됩니다.

- `src/pages/Posts/postsOverlay.ts`: 변경분 모델, `addRow` / `editRow` / `removeRow` / `removeRows`, 합치기 함수 `mergePosts` (모두 순수 함수)
- `src/pages/Posts/postsMutations.ts`: 낙관적 업데이트와 롤백, 사용자용 오류 메시지
  - 수정은 id별로 확정 값과 대기 중인 요청 목록을 따로 두고, 화면 값은 필드마다 가장 나중에 보낸 요청의 값을 씁니다.
  - 요청이 성공하면 확정으로 옮기고, 실패하면 그 요청만 뺍니다. 응답 순서와 상관없이 다른 요청의 변경은 남습니다.
  - 이미 삭제 중이거나 삭제한 행은 다시 요청하지 않습니다. 삭제 스냅샷에는 서버 원본 제목을 기억합니다.
- `src/pages/Posts/usePostsOverlay.ts`: 위를 묶은 훅 (아직 화면에 연결하지 않음)

수정·추가할 수 있는 필드는 `title`, `tags`뿐입니다. (`likes`, `views`는 서버 값)

삭제와 행 선택

- 각 행의 "삭제"(이름: "'제목' 삭제")를 누르면 확인 대화상자(`role="alertdialog"`)가 열립니다. 기본 포커스는 "취소"이고, ESC는 취소와 같으며, 바깥 클릭으로는 닫히지 않습니다.
- 체크박스(이름: "'제목' 선택", 헤더: "현재 페이지 전체 선택")로 여러 행을 고르면 "N개 선택됨"과 "선택 삭제"가 나타납니다. 일부만 고르면 헤더 체크박스가 일부 선택(indeterminate)으로 보입니다.
- 일괄 삭제는 DummyJSON에 일괄 API가 없어 행마다 DELETE를 보냅니다. 일부만 실패하면 실패한 행만 되살리고 "게시글 N건 삭제에 실패했습니다."로 알립니다.
- (결정) 선택은 지금 보이는 페이지·검색 결과에만 둡니다. 페이지나 검색어가 바뀌면 선택을 비우고, 삭제를 확정해도 비웁니다. 보이지 않는 행이 선택된 채 남아 실수로 함께 지워지는 것을 막기 위해서입니다.
- 삭제를 확정하면 지운 행의 버튼이 사라지므로 포커스는 목록 제목으로 갑니다.
- 한 페이지의 행이 삭제로 모두 사라지면 "이 페이지의 게시글이 모두 삭제되었습니다."와 "첫 페이지로"를 보여 줍니다. 총 건수가 0이면 기존 빈 상태를 씁니다.

알려진 한계

- 추가한 행은 1페이지 맨 앞에 붙고 잘라내지 않아, 1페이지가 10건을 넘을 수 있습니다.
- 추가한 행 때문에 총 페이지 수는 늘어나지만, 그 행은 1페이지에만 보입니다. (화면은 추가가 접수되면 검색어를 유지한 채 1페이지로 이동합니다)
- 검색어가 있을 때 새 제목이 검색어에 맞지 않으면, 추가한 행은 1페이지로 이동해도 보이지 않고 총 건수에도 들어가지 않습니다. 검색어를 지우면 보입니다.
- 수정해서 새로 검색어에 맞게 된 행은 서버 응답에 없으면 보이지 않습니다.
- 서버 데이터가 바뀌어 다시 불러와도 확정된 수정 값이 계속 새 서버 값을 덮고, 기억해 둔 서버 원본 제목도 갱신되지 않습니다. (DummyJSON은 데이터가 바뀌지 않아 지금은 드러나지 않음)
- 삭제 중이거나 삭제한 행도 수정 요청은 나갑니다. 화면에서는 그 행이 숨겨져 있어 수정할 수 없지만, UI 단계에서 막을지 정해야 합니다.
- 추가한 행의 id는 음수 임시 id(-1, -2 …)입니다. 화면은 번호 열에 숫자 대신 "신규"를 보여줍니다.
- 추가·수정 실패 알림(`role="alert"`)은 모달(`aria-modal`)이 열려 있는 동안 일부 스크린리더에서 읽히지 않을 수 있습니다. 제출하면 모달이 바로 닫혀 보통은 해당하지 않지만, 다른 모달을 연 뒤 이전 요청이 늦게 실패하면 해당합니다.
- 알림을 닫거나 수정할 행이 사라지면 포커스가 목록 제목(`h2`, `tabIndex="-1"`)으로 갑니다. 포커스 표시는 브라우저 기본 링을 따르며 따로 스타일을 두지 않았습니다. 마우스로 닫으면 보통 표시되지 않습니다.
- 목록·추가·수정 오류에서 `TypeError`는 모두 네트워크 오류로 봅니다. 코드 버그로 난 `TypeError`도 "네트워크 연결을 확인해 주세요"로 보일 수 있습니다.
- (의도) 수정 모달에서 저장하면 모달에 보였던 값 전체를 현재 행과 비교해 저장합니다. 모달이 열린 동안 행이 바뀌면(이전 수정의 롤백 등), 사용자가 손대지 않은 필드도 열 때의 값으로 저장될 수 있습니다. 사용자가 본 값이 그대로 저장되는 쪽을 택했습니다.
- 수정할 행을 찾을 수 없다고 알리는 경우는 추가한 행이 사라졌을 때(추가 요청 실패로 롤백)뿐입니다. 서버 행은 모달이 열린 동안 목록이 다른 페이지로 바뀌어도 열 때의 행을 기준으로 저장합니다.
- 오류 알림이 뜨면 메시지가 채워지기 전 약 100ms 동안 빈 알림 상자와 닫기 버튼만 보입니다. (같은 문구를 다시 읽히게 하려고 비워 두는 시간이며, 닫기 버튼의 포커스를 유지하려고 버튼은 남겨 둡니다)
- 목록 조회 오류 화면과 "마지막으로 불러온 목록" 안내의 `role="alert"`는 조건부로 마운트됩니다. 추가·수정 실패 알림처럼 항상 DOM에 두지 않아 일부 스크린리더가 놓칠 수 있습니다.
- (접근성 개선 후보) "다시 시도"를 누르면 버튼이 비활성화되고, 성공하면 오류 영역과 함께 버튼이 사라져 포커스가 body로 떨어질 수 있습니다.
- 서버 행을 수정해 검색 조건을 벗어나면 그 행은 숨기지만, 총 건수에는 지금 보이는 페이지의 행만 반영됩니다.
- 삭제 후에는 서버의 페이지 구성이 그대로라 페이지 경계의 행 구성이 약간 어긋납니다. (총 건수는 삭제한 행의 스냅샷으로 맞춤)
- 삭제한 자리를 다음 페이지의 행이 채우지 않습니다. 그래서 1페이지의 행을 모두 지우면 1페이지에는 "모두 삭제되었습니다" 안내만 보이고("첫 페이지로" 버튼은 없음), 남은 게시글은 2페이지부터 볼 수 있습니다.
- 검색 조건은 제목만 봅니다. 서버 검색은 본문도 보므로, 본문만 검색어에 맞는 삭제 행은 총 건수에서 빠지지 않습니다.
- 변경분은 훅을 쓰는 컴포넌트에 있어, 페이지를 떠나거나 새로고침하면 사라집니다.

### Architecture

- Design Token
- SCSS Architecture
- Reusable Component Structure
- Route Management
- API State Management
- Storybook Documentation

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### State Management

- TanStack Query

### Routing

- React Router

### Styling

- SCSS
- Design Token
- BEM 기반 클래스 구조

### Documentation

- Storybook
- MDX

### Testing and Accessibility

- Vitest
- Playwright
- Storybook Accessibility Addon

### Version Control

- Git
- GitHub

---

## Getting Started

### Install

```bash
npm install
```

### Run Application

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

TypeScript 타입 검사와 Vite production build를 실행합니다.

### Run ESLint

```bash
npm run lint
```

프로젝트 소스의 ESLint 검사를 실행합니다.

---

## Storybook

Storybook 보기: https://yumin-pub.github.io/ars-admin-ui/ (`main`에 push되면 `.github/workflows/deploy-pages.yml`이 GitHub Pages에 자동 배포)

데모 앱 보기: https://yumin-pub.github.io/ars-admin-ui/demo/ (예: [게시글 관리](https://yumin-pub.github.io/ars-admin-ui/demo/ui/posts). 같은 워크플로가 함께 배포)

### Run Storybook

```bash
npm run storybook
```

Storybook은 기본적으로 다음 주소에서 실행됩니다.

```text
http://localhost:6006
```

### Build Storybook

```bash
npm run build-storybook
```

배포 가능한 Storybook 정적 빌드를 생성합니다.

Storybook에서는 다음 내용을 확인할 수 있습니다.

- 컴포넌트별 Playground
- Props 기반 상태 변경
- 실제 UI 페이지 예제
- React 컴포넌트 사용 방법
- HTML 클래스 사용 방법
- 접근성 고려사항
- 디자인 토큰 및 Foundation 문서

---

## Validation

현재 구현된 프로젝트는 다음 검증 과정을 기준으로 관리합니다.

```bash
npm run build
npm run build-storybook
npm run lint
npm test
```

- 로직 단위 테스트 (`src/**/*.test.{ts,tsx}`, Vitest node 환경, 네트워크 없이 fetch 모의)
- TypeScript 타입 검사
- Vite production build
- Storybook static build
- ESLint 검사

컴포넌트 수정 및 문서 업데이트 시 실제 구현과 Storybook 문서 간의 일치 여부를 함께 확인합니다.

---

## Directory Structure

```text
.
├ .storybook
│  ├ main.ts
│  └ preview.tsx
│
├ public
│
├ src
│  ├ assets
│  │
│  ├ components
│  │  ├ Badge
│  │  ├ Button
│  │  ├ Checkbox
│  │  ├ Input
│  │  ├ Loading
│  │  ├ Modal
│  │  ├ Pagination
│  │  ├ Radio
│  │  ├ Select
│  │  └ Table
│  │
│  ├ pages
│  ├ routes
│  ├ stories
│  ├ styles
│  ├ App.tsx
│  └ main.tsx
│
├ package.json
├ tsconfig.json
└ vite.config.ts
```

### Styles

```text
src/styles
├ abstracts
├ base
├ components
├ layout
├ pages
├ tokens
├ common.scss
└ main.scss
```

### Directory Roles

| Directory | Description |
| --- | --- |
| `.storybook` | Storybook 전역 설정 |
| `src/assets` | 이미지, 아이콘, 폰트 등 정적 리소스 |
| `src/components` | 재사용 가능한 React UI 컴포넌트 |
| `src/pages` | 컴포넌트 및 관리자 화면 예제 페이지 |
| `src/routes` | 애플리케이션 라우트 관리 |
| `src/stories` | Storybook Stories 및 MDX 문서 |
| `src/styles/abstracts` | SCSS 함수, 믹스인 등 추상화 도구 |
| `src/styles/base` | Reset 및 기본 요소 스타일 |
| `src/styles/components` | 공통 UI 컴포넌트 스타일 |
| `src/styles/layout` | 레이아웃 관련 스타일 |
| `src/styles/pages` | 페이지 단위 스타일 |
| `src/styles/tokens` | 색상, 간격, 타이포그래피 등 디자인 토큰 |

---

## Component Status

| Component | React Component | Storybook | Documentation |
| --- | --- | --- | --- |
| Badge | Implemented | Implemented | Implemented |
| Button | Implemented | Implemented | Implemented |
| Input | Implemented | Implemented | Implemented |
| Radio | Implemented | Implemented | Implemented |
| Checkbox | Implemented | Implemented | Implemented |
| Select | Implemented | Implemented | Implemented |
| Pagination | Implemented | Implemented | Implemented |
| Table | Implemented | Implemented | Implemented |
| Modal | Implemented | Implemented | Implemented |
| Loading | Implemented | Implemented | Implemented |
| Empty State | Planned | - | - |
| Error State | Planned | - | - |
| CRUD Example | Planned | - | - |

`Implemented`는 React 컴포넌트 구현뿐 아니라 Storybook Stories, MDX 문서 및 실제 예제 페이지와의 일치 여부를 검토한 상태를 의미합니다.

---

## Documentation Principles

Storybook 문서는 실제 구현 범위와 일치하도록 관리합니다.

문서에서 설명하는 기능은 다음 항목과 교차 확인합니다.

- React Component
- TypeScript Props
- Storybook Stories
- MDX Documentation
- Example Page
- HTML Class Structure
- SCSS Styles

구현되지 않은 기능은 완료된 기능처럼 문서에 포함하지 않으며, 예정된 기능은 별도로 구분합니다.

- 하위호환 정책: [Compatibility Policy](src/stories/introduction/Compatibility%20Policy.mdx) (Storybook `Introduction/Compatibility Policy`)
- 변경 내역: [CHANGELOG.md](CHANGELOG.md) (release-please가 `main`의 커밋 제목으로 자동 갱신. 커밋 제목 규칙은 하위호환 정책 문서의 "커밋 제목 규칙")

---

## Project Focus

이 프로젝트는 단순히 UI를 구현하는 데 목적을 두지 않습니다.

퍼블리싱 실무에서 사용해 온 HTML 및 SCSS 구조를 React 환경에서 재사용 가능한 컴포넌트로 전환하고, 이를 Storybook으로 문서화하는 과정을 통해 다음 역량을 보여주는 것을 목표로 합니다.

- UI 구조 분석
- 컴포넌트 설계
- 퍼블리싱 구조화
- React 및 TypeScript 활용
- SCSS 아키텍처 설계
- 디자인 토큰 설계
- 접근성 고려
- Storybook 기반 컴포넌트 문서화
- 문서와 실제 구현 간의 일관성 관리

---

## Author

Frontend Publishing & UI System Portfolio Project

2026