# 11th_PE_Web_JS_Practice_Mission

UMC-11th Web 실습 미션 제출 레포지토리입니다.

## 🚀 개발 서버 실행하고 종료하기

```bash
cd umcine
pnpm install
pnpm dev
```

개발 서버를 종료할 때는 터미널에서 `Ctrl + C`를 누릅니다.

## 📁 디렉토리 구조

참고: 아래 구조는 워크북 3주차-8주차에서 사용합니다.

```bash
.
├─ README.md
└─ umcine/
    ├─ public/
    │   ├─ icons/
    │   └─ images/
    │       └─ movies/
    └─ src/
        ├─ routes/
        │   ├─ __root.tsx
        │   ├─ index.tsx
        │   ├─ search.tsx
        │   └─ movies.$movieId.tsx
        ├─ pages/
        │   └─ movies/
        │       ├─ movie-list-page.tsx
        │       ├─ search-page.tsx
        │       └─ movie-detail-page.tsx
        ├─ components/
        │   ├─ layout/
        │   │   └─ header.tsx
        │   └─ movies/
        │       ├─ movie-card.tsx
        │       ├─ movie-grid.tsx
        │       └─ pagination.tsx
        ├─ data/
        │   └─ movies.ts
        ├─ types/
        │   └─ movie.ts
        ├─ utils/
        │   └─ cn.ts
        ├─ main.tsx
        ├─ index.css
        └─ routeTree.gen.ts
```

### 🎬 umcine 폴더

영화 리스트 / 검색 미션 프로젝트입니다.

- `public/images/movies`: 포스터, 배경 이미지 등을 두며 `/images/movies/poster.jpg`처럼 URL 경로로 사용
- `public/icons`: 아이콘
- `src/routes`: URL 규칙과 연결할 page 컴포넌트를 작성. 화면의 자세한 내용은 route 파일에 모두 넣지 않음
- `src/pages/movies`: 영화 목록, 검색, 상세처럼 한 화면을 나타내는 page 컴포넌트
- `src/components/layout`: 여러 화면에서 함께 사용하는 Header 같은 레이아웃 컴포넌트
- `src/components/movies`: MovieCard처럼 영화 화면에서 사용하는 컴포넌트
- `src/data`: 로컬 영화 데이터
- `src/types`: 여러 파일에서 함께 사용하는 TypeScript 타입
- `src/utils`: `cn`처럼 특정 화면에 속하지 않고 여러 파일에서 사용하는 작은 함수

## 🏷️ 파일/폴더 이름 규칙

- 파일과 폴더 이름은 기본적으로 케밥 케이스를 사용 (예: `movie-list-page.tsx`)
- 컴포넌트 이름은 파스칼 케이스로 작성 (예: `MovieListPage`)
- `index.tsx`, `__root.tsx`, `movies.$movieId.tsx`처럼 TanStack Router 규칙을 따르는 route 파일과 자동 생성되는 `routeTree.gen.ts`는 해당 이름을 그대로 유지
- `stores`, `api`, `config`, `schemas`, `hooks`처럼 이후에 필요한 폴더는 실제로 사용하는 주차에 추가하고, 아직 사용하지 않는 빈 폴더는 미리 만들지 않음

## 🌳 branch 규칙

```bash
├─main
    ├─kasa/main
	...
```

1. `닉네임/main 브랜치`가 기본 브랜치로 pr 보낼 때 root 브랜치(main 브랜치)가 아닌 닉네임/main 브랜치로 올립니다.
2. 매주 실습, 미션은 각자의 닉네임/main 브랜치를 base 브랜치로 삼아 fork한 레포지터리에서 base branch에 pull request를 생성합니다.
3. 교육국장 approve를 받으면, pr을 머지하고 이때, pr 제목은
   `[n주차/닉네임] 미션 제출합니다` 형식으로 작성합니다.

## 🔖 커밋 컨벤션

**예시**

- `mission: 2주차 미션 제출`
- `fix: 영화 카드 클릭 오류 수정`
- `practice: 2주차 미니 실습 - 영화 정보 카드 작성하기 제출`

| Message  | 설명                  |
| -------- | --------------------- |
| mission  | 미션 수행             |
| practice | 미니 실습 수행        |
| fix      | 버그 수정             |
| docs     | 문서 수정             |
| comment  | 주석 추가 및 변경     |
| test     | 테스트 코드 추가      |
| rename   | 파일 혹은 폴더명 수정 |
| remove   | 파일 혹은 폴더 삭제   |
| chore    | 기타 변경사항         |

```
11th_PE_Web_JS_Practice_Mission
├─ package.json
├─ pnpm-lock.yaml
├─ README.md
└─ umcine
   ├─ .tanstack
   │  └─ tmp
   ├─ dist
   │  ├─ assets
   │  │  ├─ index-BO1UsoDN.js
   │  │  └─ index-HifG7Abt.css
   │  ├─ favicon.svg
   │  ├─ icons.svg
   │  ├─ images
   │  │  ├─ logos
   │  │  │  └─ tmdb-logo.svg
   │  │  └─ movies
   │  │     ├─ colony-backdrop.jpg
   │  │     ├─ colony.jpg
   │  │     ├─ death-of-robin-hood-backdrop.jpg
   │  │     ├─ death-of-robin-hood.jpg
   │  │     ├─ evil-dead-burn-backdrop.jpg
   │  │     ├─ evil-dead-burn.jpg
   │  │     ├─ last-house-backdrop.jpg
   │  │     ├─ last-house.jpg
   │  │     ├─ minions-monsters-backdrop.jpg
   │  │     ├─ minions-monsters.jpg
   │  │     ├─ obsession-backdrop.jpg
   │  │     ├─ obsession.jpg
   │  │     ├─ odyssey-backdrop.jpg
   │  │     ├─ odyssey.jpg
   │  │     ├─ spider-man-brand-new-day-backdrop.jpg
   │  │     ├─ spider-man-brand-new-day.jpg
   │  │     ├─ spider-man-no-way-home-backdrop.jpg
   │  │     ├─ spider-man-no-way-home.jpg
   │  │     ├─ toy-story-5-backdrop.jpg
   │  │     └─ toy-story-5.jpg
   │  ├─ index.html
   │  ├─ movie-icons
   │  │  ├─ arrow-right.svg
   │  │  ├─ bookmark-outline.svg
   │  │  ├─ bookmark.svg
   │  │  ├─ chevron-left.svg
   │  │  ├─ chevron-right.svg
   │  │  ├─ close.svg
   │  │  ├─ edit.svg
   │  │  ├─ lock.svg
   │  │  ├─ mail.svg
   │  │  ├─ movie.svg
   │  │  ├─ person.svg
   │  │  ├─ search.svg
   │  │  ├─ star-outline.svg
   │  │  └─ star.svg
   │  └─ SOURCES.md
   ├─ eslint.config.js
   ├─ index.html
   ├─ package.json
   ├─ pnpm-lock.yaml
   ├─ public
   │  ├─ favicon.svg
   │  ├─ icons.svg
   │  ├─ images
   │  │  ├─ logos
   │  │  │  └─ tmdb-logo.svg
   │  │  └─ movies
   │  │     ├─ colony-backdrop.jpg
   │  │     ├─ colony.jpg
   │  │     ├─ death-of-robin-hood-backdrop.jpg
   │  │     ├─ death-of-robin-hood.jpg
   │  │     ├─ evil-dead-burn-backdrop.jpg
   │  │     ├─ evil-dead-burn.jpg
   │  │     ├─ last-house-backdrop.jpg
   │  │     ├─ last-house.jpg
   │  │     ├─ minions-monsters-backdrop.jpg
   │  │     ├─ minions-monsters.jpg
   │  │     ├─ obsession-backdrop.jpg
   │  │     ├─ obsession.jpg
   │  │     ├─ odyssey-backdrop.jpg
   │  │     ├─ odyssey.jpg
   │  │     ├─ spider-man-brand-new-day-backdrop.jpg
   │  │     ├─ spider-man-brand-new-day.jpg
   │  │     ├─ spider-man-no-way-home-backdrop.jpg
   │  │     ├─ spider-man-no-way-home.jpg
   │  │     ├─ toy-story-5-backdrop.jpg
   │  │     └─ toy-story-5.jpg
   │  ├─ movie-icons
   │  │  ├─ arrow-right.svg
   │  │  ├─ bookmark-outline.svg
   │  │  ├─ bookmark.svg
   │  │  ├─ chevron-left.svg
   │  │  ├─ chevron-right.svg
   │  │  ├─ close.svg
   │  │  ├─ edit.svg
   │  │  ├─ lock.svg
   │  │  ├─ mail.svg
   │  │  ├─ movie.svg
   │  │  ├─ person.svg
   │  │  ├─ search.svg
   │  │  ├─ star-outline.svg
   │  │  └─ star.svg
   │  └─ SOURCES.md
   ├─ README.md
   ├─ src
   │  ├─ App.css
   │  ├─ App.tsx
   │  ├─ assets
   │  │  ├─ hero.png
   │  │  ├─ react.svg
   │  │  └─ vite.svg
   │  ├─ components
   │  │  ├─ header.tsx
   │  │  ├─ movie-card.tsx
   │  │  ├─ movie-grid.tsx
   │  │  └─ pagination.tsx
   │  ├─ data
   │  │  └─ movies.ts
   │  ├─ index.css
   │  ├─ main.tsx
   │  └─ types
   │     └─ movie.ts
   ├─ tsconfig.app.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   └─ vite.config.ts

```