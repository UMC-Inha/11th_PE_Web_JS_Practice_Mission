import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">

          <Link className="logo" to="/">
            <span className="logo-icon">
              <img src="/icons/movie.svg" alt="" />
            </span>
            <span>UMCine</span>
          </Link>

          <nav className="nav">
            <Link to="/">영화</Link>
            <Link to="/search">검색</Link>
            <a href="#">내 정보</a>
          </nav>

        </div>

        <div className="header-right">
          <button className="search-button" type="button">
            <img src="/icons/search.svg" alt="검색" />
          </button>

          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}