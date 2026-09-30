export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <img src="/movie-icons/movie.svg" alt="UMCine" />
          <strong>UMCine</strong>
        </div>

        <nav className="nav">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>

        <div className="header-actions">
          <button
            className="search-button"
            type="button"
            aria-label="검색"
          >
            <img src="/movie-icons/search.svg" alt="" />
          </button>

          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}