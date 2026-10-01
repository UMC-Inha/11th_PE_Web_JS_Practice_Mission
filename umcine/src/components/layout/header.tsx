import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <Link className="logo" to="/">
          <img src="/icons/movie.svg" alt="" width={24} height={24} />
          <span>UMCine</span>
        </Link>
        <nav className="nav">
          <Link className="nav__link nav__link--active" to="/">
            영화
          </Link>
          <Link className="nav__link" to="/search">
            검색
          </Link>
          <a className="nav__link" href="/">
            내 정보
          </a>
        </nav>
      </div>
      <div className="header__right">
        <button type="button" className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" width={20} height={20} />
        </button>
        <button type="button" className="login-button">
          로그인
        </button>
      </div>
    </header>
  );
}