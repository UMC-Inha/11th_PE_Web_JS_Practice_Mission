import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const navClass = (active: boolean) =>
    cn("text-sm", active ? "font-bold text-[#181a20] underline underline-offset-8" : "text-[#555d6b]");
  return (
    <header className="h-[91px] shrink-0 border-b border-[#e2e5eb] bg-white">
      <div className="mx-auto flex h-full w-[calc(100%-40px)] max-w-[1280px] items-center gap-8 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="UMCine 영화 목록">
          <img src="/movie-icons/movie.svg" alt="" className="h-8 w-8" />
          <strong className="text-xl font-extrabold tracking-tight">UMCine</strong>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-5 sm:gap-8">
          <Link to="/" className={navClass(pathname === "/" || pathname.startsWith("/movies/"))}>영화</Link>
          <Link to="/search" search={{}} className={navClass(pathname === "/search")}>검색</Link>
          <span className="hidden text-sm text-[#555d6b] sm:inline">내 정보</span>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/search" search={{}} aria-label="영화 검색" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e2e5eb]">
            <img src="/movie-icons/search.svg" alt="" className="h-5 w-5" />
          </Link>
          <button type="button" disabled title="로그인은 다음 미션에서 연결합니다." className="hidden h-11 rounded-lg bg-[#2864fa] px-5 text-sm font-bold text-white sm:block">로그인</button>
        </div>
      </div>
    </header>
  );
}

