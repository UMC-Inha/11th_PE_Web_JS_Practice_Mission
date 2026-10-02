import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-[90px] w-full max-w-[1440px] flex-wrap items-center gap-5 px-5 py-4 lg:px-20">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[22px] font-extrabold"
        >
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border-2 border-[#191b20]">
            <img
              className="h-6 w-6"
              src="/icons/movie.svg"
              alt=""
            />
          </span>

          UMCine
        </Link>

        <nav
          className="flex items-center gap-6 text-sm font-bold text-gray-500 sm:ml-5"
          aria-label="주 메뉴"
        >
          <Link
            to="/"
            className="hover:text-[#191b20]"
            activeOptions={{
              exact: true,
            }}
            activeProps={{
              className:
                "text-[#191b20] underline underline-offset-4",
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            className="hover:text-[#191b20]"
            activeOptions={{
              includeSearch: false,
            }}
            activeProps={{
              className:
                "text-[#191b20] underline underline-offset-4",
            }}
          >
            검색
          </Link>

          <button
            type="button"
            disabled
          >
            내 정보
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/search"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-gray-200"
            aria-label="검색"
          >
            <img
              className="h-6 w-6 opacity-60"
              src="/icons/search.svg"
              alt=""
            />
          </Link>

          <button
            type="button"
            className="h-[42px] rounded-lg bg-blue-600 px-4 text-sm font-bold text-white"
            disabled
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}