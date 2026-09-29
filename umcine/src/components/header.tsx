export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="#movies" className="logo">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>

        <nav className="nav">
          <a href="#movies" className="active">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button type="button" className="search-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button type="button" className="mypage-button">
          로그인
        </button>
      </div>
    </header>
  );
}