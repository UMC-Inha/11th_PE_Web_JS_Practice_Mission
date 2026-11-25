"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "../../queries/member-queries";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

function NavLink({
  to,
  exact,
  children,
}: {
  to: "/" | "/search" | "/mypage";
  exact?: boolean;
  children: string;
}) {
  const pathname = usePathname();
  // exact면 경로가 같을 때만, 아니면 하위 경로까지 활성으로 봄
  const isActive = exact
    ? pathname === to
    : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link href={to} className="no-underline">
      <span
        className={cn(
          "text-[15px] font-medium",
          isActive
            ? "font-bold text-gray-900 underline underline-offset-8"
            : "text-gray-400",
        )}
      >
        {children}
      </span>
    </Link>
  );
}

function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const router = useRouter();
  const queryClient = useQueryClient();
  // 토큰이 있을 때만 내 정보를 조회함
  const meQuery = useQuery(meQueryOptions(Boolean(accessToken)));

  const handleLogout = () => {
    setAccessToken(null);
    // 이전 사용자의 정보가 남지 않도록 로그인 사용자별 캐시를 지움
    for (const key of ["members", "favorites", "ratings"]) {
      queryClient.removeQueries({ queryKey: [key] });
    }
    router.push("/");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1126px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-10">
          <Link
            className="flex items-center gap-1.5 text-lg font-extrabold text-gray-900 no-underline"
            href="/"
          >
            <img
              className="h-[22px] w-[22px]"
              src="/icons/movie.svg"
              alt=""
              aria-hidden="true"
            />
            <span>UMCine</span>
          </Link>
          {/* usePathname은 요청 시점에 알 수 있는 값이라 Suspense로 감싸 정적 셸을 막지 않게 함 */}
          <Suspense>
            <nav className="flex items-center gap-6">
              <NavLink to="/" exact>
                영화
              </NavLink>
              <NavLink to="/search">검색</NavLink>
              <NavLink to="/mypage">내 정보</NavLink>
            </nav>
          </Suspense>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white"
            aria-label="검색"
          >
            <img
              className="h-[18px] w-[18px]"
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
            />
          </button>
          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-9 items-center rounded-lg bg-app-accent px-[18px] text-sm font-bold text-white no-underline"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <>
              <Link
                href="/mypage"
                className="flex h-9 items-center rounded-lg bg-app-accent px-[18px] text-sm font-bold text-white no-underline"
              >
                마이페이지
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="h-9 rounded-lg border border-gray-200 bg-white px-[18px] text-sm font-bold text-app-text-h"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
