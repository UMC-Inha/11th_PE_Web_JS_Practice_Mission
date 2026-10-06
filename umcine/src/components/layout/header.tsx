import { Link } from "@tanstack/react-router";
import "../../App.css";

const navItems = ["영화", "검색", "내 정보"];

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <Link className="brand" to="/" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="navigation-list">
            {navItems.map((item) => (
              <li key={item}>
                {item === "영화" ? (
                  <Link
                      to="/"
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "is-active" }}
                  >
                    {item}  
                  </Link>
                ) : item === "검색" ? (
                  <Link to="/search" activeProps={{ className: "is-active" }}>
                    {item}
                  </Link>
                ) : (
                  <a href="#movie-list">{item}</a>
                )
              }
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link className="search-button" to="/search" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </Link>
          <button className="login-button" type="button">로그인</button>
        </div>
      </div>
    </header>
  );
}
