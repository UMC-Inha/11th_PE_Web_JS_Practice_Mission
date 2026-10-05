import { Link, useMatchRoute } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClass = "text-sm leading-[17px] font-bold";
const activeNavLinkClass = "text-[#17191E] underline";
const inactiveNavLinkClass = "text-[#606774]";

export function Header() {
  const matchRoute = useMatchRoute();
  // 영화 메뉴는 목록과 상세 화면 모두에서 활성화한다.
  const isMoviesActive = Boolean(
    matchRoute({ to: "/" }) || matchRoute({ to: "/movies/$movieId" }),
  );

  return (
    <header className="border-b border-[#E3E6EB] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-20 py-6">
        <div className="flex items-center gap-[42px]">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191E]">
              <img src="/icons/movie-creation.png" alt="" className="size-6" />
            </span>
            <span className="text-xl leading-6 font-black tracking-[-0.7px] text-[#17191E]">
              UMCine
            </span>
          </Link>

          <nav aria-label="주요 메뉴" className="flex items-center gap-[30px]">
            <Link
              to="/"
              className={cn(
                navLinkClass,
                isMoviesActive ? activeNavLinkClass : inactiveNavLinkClass,
              )}
            >
              영화
            </Link>
            <Link
              to="/search"
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
              inactiveProps={{ className: inactiveNavLinkClass }}
            >
              검색
            </Link>
            <span className={cn(navLinkClass, inactiveNavLinkClass)}>내 정보</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-[#E3E6EB] bg-white text-[#606774]"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </Link>
          <button
            type="button"
            className="flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-sm leading-[17px] font-extrabold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
