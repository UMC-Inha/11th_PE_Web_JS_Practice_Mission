import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <span className="brand-icon">
            <img
              src="/icons/movie.svg"
              alt=""
            />
          </span>

          <span>UMCine</span>
        </div>

        <nav
          className="header-nav"
          aria-label="주 메뉴"
        >
          <Link
            to="/"
            className="nav-button"
          >
            영화
          </Link>

          <Link
            to="/search"
            className="nav-button"
          >
            검색
          </Link>

          <button
            type="button"
            className="nav-button"
            disabled
          >
            내 정보
          </button>
        </nav>

        <div className="header-actions">
          <Link
            to="/search"
            className="search-button"
            aria-label="검색"
          >
            <img
              src="/icons/search.svg"
              alt=""
            />
          </Link>

          <button
            type="button"
            className="login-button"
            disabled
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}