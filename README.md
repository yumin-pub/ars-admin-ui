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

각 컴포넌트는 Storybook에서 독립적으로 확인할 수 있으며, Playground와 실제 페이지 예제를 통해 동작과 사용 방법을 함께 제공합니다.

---

## Project Goals

### UI System

현재 구현된 컴포넌트입니다.

- Button
- Input
- Radio
- Checkbox
- Select
- Table
- Pagination
- Modal

### Planned Components

추후 추가할 예정인 공통 상태 컴포넌트입니다.

- Loading
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

### Run ESLint

```bash
npm run lint
```

---

## Storybook

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

Storybook에서는 다음 내용을 확인할 수 있습니다.

- 컴포넌트별 Playground
- Props 기반 상태 변경
- 실제 UI 페이지 예제
- React 컴포넌트 사용 방법
- HTML 클래스 사용 방법
- 접근성 고려사항
- 디자인 토큰 및 Foundation 문서

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
│  │  ├ Button
│  │  ├ Checkbox
│  │  ├ Input
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
| Button | Implemented | Implemented | Implemented |
| Input | Implemented | Implemented | Implemented |
| Radio | Implemented | Implemented | Implemented |
| Checkbox | Implemented | Implemented | Implemented |
| Select | Implemented | Implemented | Implemented |
| Pagination | Implemented | Implemented | Implemented |
| Table | Implemented | Review in progress | Review in progress |
| Modal | Implemented | Review in progress | Review in progress |
| Loading | Planned | - | - |
| Empty State | Planned | - | - |
| Error State | Planned | - | - |
| CRUD Example | Planned | - | - |

`Review in progress` 항목은 컴포넌트 구현 여부와 별개로 Storybook 구성 및 문서 내용의 일치 여부를 점검하고 있다는 의미입니다.

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
- 문서와 실제 구현 간의 일관성 관리

---

## Author

Frontend Publishing & UI System Portfolio Project

2026