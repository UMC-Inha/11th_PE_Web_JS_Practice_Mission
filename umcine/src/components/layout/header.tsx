import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <div className="header__logo">
            <img src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </div>
          <nav className="header__nav">
            <Link to="/" className="is-active">영화</Link>
            <Link to="/search">검색</Link>
            <a href="#">내 정보</a>
          </nav>
        </div>
        <div className="header__right">
          <button className="header__search">
            <img src="/icons/search.svg" alt="검색" />
          </button>
          <button className="header__login">로그인</button>
        </div>
      </div>
    </header>
  );
}