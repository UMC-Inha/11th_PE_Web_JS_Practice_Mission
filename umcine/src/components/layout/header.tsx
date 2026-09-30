import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClass = "cursor-pointer text-[13px] text-[#555]";
const activeNavLinkClass =
  "font-bold text-[#111] underline underline-offset-[5px]";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });

  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchActive = pathname === "/search";

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-[76px] w-[min(1080px,100%_-_48px)] items-center gap-9">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold text-[#111]"
        >
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <span>UMCine</span>
        </Link>

        <nav className="flex gap-6" aria-label="주요 메뉴">
          <Link
            to="/"
            className={cn(navLinkClass, isMoviesActive && activeNavLinkClass)}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={cn(navLinkClass, isSearchActive && activeNavLinkClass)}
          >
            검색
          </Link>
          {/* 내 정보 라우트가 생기면 Link로 교체 */}
          <button type="button" className={navLinkClass}>
            내 정보
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            to="/search"
            aria-label="검색"
            className="grid size-9 place-items-center rounded-lg border border-[#e5e7eb] bg-white"
          >
            <img src="/icons/search.svg" alt="" className="size-[18px]" />
          </Link>
          <button
            type="button"
            className="h-[34px] cursor-pointer rounded-md bg-[#2563EB] px-3.5 text-[13px] font-bold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}