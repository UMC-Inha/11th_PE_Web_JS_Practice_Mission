import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="header__nav" aria-label="주요 메뉴">
          <Link to="/" className="header__link">
            영화
          </Link>
          <Link to="/search" className="header__link">
            검색
          </Link>
          <button type="button" className="header__link">
            내 정보
          </button>
        </nav>

        <div className="header__actions">
          <Link to="/search" className="header__search" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </Link>
          <button type="button" className="header__login">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}