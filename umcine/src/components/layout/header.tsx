export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <div className="header__logo">
            <img src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </div>
          <nav className="header__nav">
            <a href="#" className="is-active">영화</a>
            <a href="#">검색</a>
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