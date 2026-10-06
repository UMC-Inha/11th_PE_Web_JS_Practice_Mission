import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b border-[#e3e6eb] bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-10">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-[#17191e]">
            <img className="h-[22px] w-[22px]" src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-7 text-sm text-[#606774]">
            <Link to="/" activeProps={{ className: 'font-bold text-[#2563eb]' }}>
              영화
            </Link>
            <Link to="/search" activeProps={{ className: 'font-bold text-[#2563eb]' }}>
              검색
            </Link>
            <Link to="/">내 정보</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="grid h-9 w-9 place-items-center rounded-md border border-[#e3e6eb] bg-white"
            aria-label="검색"
          >
            <img className="h-[19px] w-[19px]" src="/icons/search.svg" alt="" />
          </Link>

          <button
            className="h-9 rounded-md bg-[#2563eb] px-4 text-sm text-white hover:bg-[#1d4ed8]"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}
