"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const navItems = [
  { label: "영화", href: "/" },
  { label: "검색", href: "/search" },
  { label: "내 정보", href: "/my" },
];

export function Header() {
  const pathname = usePathname();
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
        <Link className="brand" href="/" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav aria-label="주요 메뉴">
          <ul className="navigation-list">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActive ? "is-active" : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <Link
            className="search-button"
            href="/search"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="" />
          </Link>

          {!accessToken ? (
            <Link href="/login">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link href="/my">마이페이지</Link>
          )}
        </div>
      </div>
    </header>
  );
}