import { Link, useRouterState } from "@tanstack/react-router";

const navLink = "text-sm text-gray-400";
const navLinkActive =
  "text-sm font-bold text-black underline decoration-2 underline-offset-4";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  // 목록(/)과 상세(/movies/...)에서는 "영화", 검색(/search)에서는 "검색"
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname.startsWith("/search");

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-[max(80px,calc((100%_-_1280px)/2))] py-6">
      <div className="flex items-center gap-8">
        <Link className="flex items-center gap-2 text-lg font-extrabold" to="/">
          <span className="grid size-9 place-items-center rounded-lg bg-gray-100">
            <img src="/icons/movie.svg" alt="" width={20} height={20} />
          </span>
          <span>UMCine</span>
        </Link>
        <nav className="flex gap-6">
          <Link className={isMoviesActive ? navLinkActive : navLink} to="/">
            영화
          </Link>
          <Link
            className={isSearchActive ? navLinkActive : navLink}
            to="/search"
          >
            검색
          </Link>
          <a className="text-sm text-gray-400" href="/">
            내 정보
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-lg bg-gray-100"
          aria-label="검색"
        >
          <img src="/icons/search.svg" alt="" width={20} height={20} />
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}