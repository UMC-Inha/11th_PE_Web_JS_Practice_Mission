"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

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

  const getNavClassName = (href: string) =>
    pathname === href ? "font-bold text-[#2563eb]" : "text-[#606774]";

  return (
    <header className="border-b border-[#e3e6eb] bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-10">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-extrabold text-[#17191e]"
          >
            <img className="h-[22px] w-[22px]" src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-7 text-sm">
            <Link href="/" className={getNavClassName("/")}>
              영화
            </Link>

            <Link href="/search" className={getNavClassName("/search")}>
              검색
            </Link>

            <Link href="/me" className={getNavClassName("/me")}>
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="grid h-9 w-9 place-items-center rounded-md border border-[#e3e6eb] bg-white"
            aria-label="검색"
          >
            <img className="h-[19px] w-[19px]" src="/icons/search.svg" alt="" />
          </Link>

          {!accessToken ? (
            <Link href="/login">로그인</Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link href="/me">마이페이지</Link>
          )}
        </div>
      </div>
    </header>
  );
}
