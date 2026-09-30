import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

function NavLink({
  to,
  exact,
  children,
}: {
  to: "/" | "/search";
  exact?: boolean;
  children: string;
}) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      className="no-underline"
    >
      {({ isActive }) => (
        <span
          className={cn(
            "text-[15px] font-medium",
            isActive
              ? "font-bold text-gray-900 underline underline-offset-8"
              : "text-gray-400",
          )}
        >
          {children}
        </span>
      )}
    </Link>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1126px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-10">
          <Link
            className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900 no-underline"
            to="/"
          >
            <img
              className="h-[22px] w-[22px]"
              src="/icons/movie.svg"
              alt=""
              aria-hidden="true"
            />
            <span>UMCine</span>
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink to="/" exact>
              영화
            </NavLink>
            <NavLink to="/search">검색</NavLink>
            <a
              className="text-[15px] font-medium text-gray-400 no-underline"
              href="/mypage"
            >
              내 정보
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white"
            aria-label="검색"
          >
            <img
              className="h-[18px] w-[18px]"
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="h-9 rounded-lg border-none bg-app-accent px-[18px] text-sm font-bold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
