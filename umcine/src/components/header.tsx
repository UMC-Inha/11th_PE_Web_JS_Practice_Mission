const navItems = ["홈", "영화", "TV 프로그램", "인물", "즐겨찾기"];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <a className="brand" href="#top" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>
        <nav aria-label="주요 메뉴">
          <ul className="navigation-list">
            {navItems.map((item) => (
              <li key={item}>
                <a className={item === "영화" ? "is-active" : undefined} href="#movie-list">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-button" type="button" aria-label="검색"><img src="/icons/search.svg" alt="" /></button>
          <button className="login-button" type="button">로그인</button>
        </div>
      </div>
    </header>
  );
}
