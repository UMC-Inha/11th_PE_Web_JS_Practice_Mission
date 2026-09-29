import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-[#e2e5eb] bg-white px-[5.5%] py-7 max-[600px]:flex-wrap max-[600px]:py-5">
      <div className="flex items-center gap-12 max-[1000px]:gap-6 max-[600px]:flex-wrap max-[600px]:gap-4">
        <a
          href="#movies"
          className="flex items-center gap-[10px] text-2xl font-extrabold"
        >
          <img
            src="/icons/movie.svg"
            alt=""
            className="h-9 w-9"
          />
          <span>UMCine</span>
        </a>

        <nav className="flex items-center gap-8 font-bold text-[#6b7280] max-[1000px]:gap-4">
          <Link
            to="/"
            activeProps={{
              className:
                "text-[#202124] underline underline-offset-4",
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            activeProps={{
              className:
                "text-[#202124] underline underline-offset-4",
            }}
          >
            검색
          </Link>

          <a href="#">내 정보</a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-lg border border-[#e2e5eb] bg-white"
          aria-label="검색"
        >
          <img
            src="/icons/search.svg"
            alt=""
            className="h-6 w-6"
          />
        </button>

        <button
          type="button"
          className="h-12 rounded-lg bg-blue-600 px-5 font-bold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}