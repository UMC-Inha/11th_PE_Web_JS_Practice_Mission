import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import "../../App.css";

const navItems = ["영화", "검색", "내 정보"];

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

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
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link className="search-button" to="/search" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </Link>
          {!accessToken ? (
            <Link to="/login">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link to="/my">마이페이지</Link>
          )}
        </div>
      </div>
    </header>
  );
}
