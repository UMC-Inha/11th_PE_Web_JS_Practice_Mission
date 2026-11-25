# TanStack Router → Next.js 마이그레이션 기록

원본: `umcine/` (Vite + TanStack Router) — 수정하지 않고 그대로 둠
결과: `umcine-next/umcine/` (Next.js 16.4.6 App Router)

## 1. 예제 프로젝트(nextjs-example)에서 가져온 설정

| 파일 | 내용 |
|---|---|
| `package.json` | next 16.4.6, react 19.3.0, `@tailwindcss/turbopack` 구성 + 기존 라이브러리(react-query, zustand, ky, clsx, tailwind-merge) 추가 |
| `tsconfig.json` | 예제 그대로, `@/*` 경로만 `./src/*` 로 변경 |
| `next.config.ts` | `cacheComponents`, `partialPrefetching`, turbopack CSS 로더 그대로. 이미지 도메인만 `image.tmdb.org` 로 변경 |
| `pnpm-workspace.yaml`, `.gitignore`, `AGENTS.md` | 그대로 복사 |
| `.env.local` | 변수 이름만 `VITE_` → `NEXT_PUBLIC_` (git에 올라가지 않음) |

## 2. 라우트 파일 대응

| 기존 (TanStack) | 변경 (Next.js) | URL |
|---|---|---|
| `main.tsx` + `routes/__root.tsx` + `index.html` | `src/app/layout.tsx`, `src/app/providers.tsx` | – |
| `__root`의 notFoundComponent | `src/app/not-found.tsx` | – |
| `routes/index.tsx` | `src/app/page.tsx` | `/` |
| `routes/movies.$movieId.tsx` | `src/app/movies/[movieId]/page.tsx` | `/movies/:id` |
| `routes/search.tsx` (validateSearch) | `src/app/search/page.tsx` (searchParams) | `/search?query=` |
| `routes/login.tsx` (beforeLoad) | `src/app/login/page.tsx` + `GuestOnly` | `/login` |
| `routes/signup.tsx` | `src/app/signup/page.tsx` | `/signup` |
| `routes/_auth.tsx` (beforeLoad: requireAuth) | `src/app/(auth)/layout.tsx` + `RequireAuth` | – |
| `routes/_auth/me.tsx` | `src/app/(auth)/me/page.tsx` | `/me` |
| `routes/_auth/me_.edit.tsx` | `src/app/(auth)/me/edit/page.tsx` | `/me/edit` |

`src/pages/` → `src/views/` 로 이름 변경 (Next.js가 `src/pages`를 Pages Router로 인식하기 때문)

삭제: `routes/`, `routeTree.gen.ts`, `main.tsx`, `vite.config.ts`, `utils/auth/require-auth.ts`, Vite 템플릿 잔여물(`App.tsx`, `App.css`, `assets/`)

## 3. TanStack Router API → Next.js API

| TanStack Router | Next.js | 적용 파일 |
|---|---|---|
| `<Link to params>` | `<Link href>` (`next/link`) | movie-card, search-page, movie-detail-page, my-page, login-page, header |
| `useNavigate()` | `useRouter().push()` (`next/navigation`) | use-login-mutation, search-page, header-auth-menu |
| `useParams({ from })` | 서버 `page.tsx`에서 `await params` → props로 전달 | movie-detail-page |
| `useSearch({ from })` + `validateSearch` | 서버 `page.tsx`에서 `await searchParams` → props로 전달 | search-page |
| `useMatchRoute()`, `activeProps` | `usePathname()` | header-nav |
| `beforeLoad` + `redirect()` | 클라이언트 가드 (`useEffect` + `router.replace`) | components/auth/require-auth, guest-only |
| `<Outlet />` | layout의 `children` | layout.tsx, (auth)/layout.tsx |
| `<a href="/login">` (TODO 주석) | `<Link href="/login">` | signup-page |
| 회원가입 후 이동 (주석 처리돼 있던 코드) | `router.push("/login")` | use-signup-mutation |

## 4. 라이브러리 설정 오류 수정

| 위치 | 문제 | 수정 |
|---|---|---|
| `config/env.ts` | `import.meta.env`는 Vite 전용이라 Next에서 undefined | `process.env.NEXT_PUBLIC_*` |
| `api/auth-api.ts` | `setAccessToken(null)` 타입 오류 + apiClient와 같은 hook이 중복 등록됨 | `apiClient.extend({})` 로 정리 (401 처리는 apiClient의 `logout()`이 담당) |
| `views/auth/signup-page.tsx` | 쓰지 않는 `useNavigate` import (tsc 오류) | 제거 |
| `main.tsx`의 `QueryClient` | 모듈 최상단에서 만들면 서버에서 요청끼리 캐시를 공유 | `providers.tsx`에서 `useState(() => new QueryClient())` |
| `stores/auth-store.ts` (zustand persist) | 서버엔 localStorage가 없어 서버 HTML과 첫 클라이언트 렌더링이 달라짐 → hydration 오류 | `skipHydration: true` + 마운트 후 `rehydrate()`, `hasHydrated` 플래그 추가 |
| Tailwind | `@tailwindcss/vite` 플러그인은 Next에서 동작 안 함 | 예제처럼 `@tailwindcss/turbopack` 로더 사용 |
| Pretendard 폰트 | `index.html`의 `<link>`가 사라짐 | `layout.tsx`의 `<head>`로 이동 |

참고: ky 2.x에서는 `baseUrl`, `prefix` 둘 다 유효한 옵션이라 그대로 둠.

## 5. Server / Client Component 경계

**Server Component** (`"use client"` 없음)
- `app/layout.tsx`, `app/**/page.tsx`, `app/(auth)/layout.tsx`, `app/not-found.tsx`
- `components/layout/header.tsx` (로고·검색 버튼), `components/layout/footer.tsx`, `components/movies/movie-grid.tsx`

**Client Component** (`"use client"`)
- `app/providers.tsx` — QueryClientProvider, localStorage rehydrate
- `components/layout/header-nav.tsx` — usePathname
- `components/layout/header-auth-menu.tsx` — 로그인 상태, 로그아웃
- `components/auth/require-auth.tsx`, `guest-only.tsx` — 로그인 가드, alert
- `components/movies/movie-card.tsx`, `components/bookmark-button.tsx` — 북마크 클릭
- `views/**` 전체 — useState, useQuery, alert, URL.createObjectURL 등

**브라우저 API가 서버에서 실행되지 않게 한 방법**
- `localStorage`: zustand `skipHydration` → `useEffect` 안에서만 `rehydrate()`
- `alert`: 이벤트 핸들러, mutation 콜백, `useEffect` 안에서만 호출
- `URL.createObjectURL` / `revokeObjectURL`: 파일 선택 핸들러, effect cleanup 안에서만 호출
- `document.getElementById("root")`: 삭제 (Next가 렌더링 담당)

**cacheComponents 규칙** (요청 시점 값은 `<Suspense>` 안에서 읽기)
- `/movies/[movieId]`: `params`를 Suspense 안의 async 컴포넌트에서 await
- `/search`: `searchParams`를 Suspense 안에서 await
- Header의 `usePathname`: 동적 경로에서 suspend하므로 `<Suspense fallback={비활성 메뉴}>`로 감쌈

## 6. 검증 결과

- `pnpm typecheck` (next typegen + tsc): 오류 없음
- `pnpm build`: 성공, 9개 경로 prerender (`/movies/[movieId]`, `/search`는 Partial Prerender)
- `pnpm start` 후 요청: `/`, `/search`, `/search?query=spider`, `/movies/550`, `/login`, `/signup`, `/me`, `/me/edit` → 200, 없는 주소 → 404
- `/search?query=spider` 서버 HTML에 "spider’ 검색 결과" 포함 확인

브라우저에서 클릭 흐름(로그인 → 북마크 → 내 정보 → 로그아웃)은 아직 직접 확인하지 않음.

## 7. 동작이 달라진 점

- 회원가입 성공 후 `/login`으로 이동 (원래 주석 처리돼 있던 코드를 켬)
- `/me`, `/me/edit`에서 로그아웃하거나 토큰이 만료되면 안내 없이 `/`로 이동
- 로그인 정보를 불러오기 전 잠깐 동안 헤더의 로그인/로그아웃 영역이 비어 있음 (깜빡임 방지)
