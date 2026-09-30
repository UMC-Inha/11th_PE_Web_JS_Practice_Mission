export default function Header() {
    return (
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-icon">
              <img src="/icons/movie.svg" alt="" />
            </span>
            <span>UMCine</span>
          </div>
  
          <nav className="header-nav" aria-label="주 메뉴">
            <button type="button" className="nav-button active" aria-current="page">
              영화
            </button>
            <button type="button" className="nav-button">검색</button>
            <button type="button" className="nav-button">내 정보</button>
          </nav>
  
          <div className="header-actions">
            <button type="button" className="search-button" aria-label="검색">
              <img src="/icons/search.svg" alt="" />
            </button>
            <button type="button" className="login-button">로그인</button>
          </div>
        </div>
      </header>
    );
  }