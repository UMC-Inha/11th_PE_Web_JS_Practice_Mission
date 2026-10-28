import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 text-lg font-bold">
            <img src="/icons/movie.svg" alt="" className="h-6 w-6" />
            <span>UMCine</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link to="/" className="font-semibold text-[#111111] underline underline-offset-6">
              영화
            </Link>
            <Link to="/search">검색</Link>
            <a href="#">내 정보</a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200">
            <img src="/icons/search.svg" alt="검색" className="h-4.5 w-4.5" />
          </button>
          <button className="h-9 rounded-lg bg-[#4f5de8] px-4 text-sm font-semibold text-white">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}