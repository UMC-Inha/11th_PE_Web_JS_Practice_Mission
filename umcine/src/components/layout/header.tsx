import { Link, useRouterState } from "@tanstack/react-router";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMoviePage =
    pathname === "/" || pathname.startsWith("/movies/");

  return (
    <header className="h-[91px] w-full border-b border-[#e3e6eb] bg-white">
      <div className="flex h-full w-full items-center justify-between px-20 py-6">
        <div className="flex items-center gap-[42px]">

          <Link
            to="/"
            className="flex items-center gap-[10px]  text-xl font-black tracking-[-0.7px] text-[#17191e]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
              <img
                src="/icons/movie.svg"
                alt=""
                className="h-6 w-6"
              />
            </span>

            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-[30px]  text-sm font-bold">
            <Link
              to="/"
              className={
                isMoviePage
                  ? "text-[#17191e] underline underline-offset-4"
                  : "text-[#606774]"
              }
            >
              영화
            </Link>

            <Link
              to="/search"
              activeProps={{
                className: "text-[#17191e] underline underline-offset-4",
              }}
              inactiveProps={{
                className: "text-[#606774]",
              }}
            >
              검색
            </Link>

            <a href="#" className="text-[#606774]">
              내 정보
            </a>
          </nav>

        </div>

        <div className="flex items-center gap-[10px]">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-6 w-6"
            />
          </Link>

          <button
            type="button"
            className="flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4  text-sm font-extrabold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}