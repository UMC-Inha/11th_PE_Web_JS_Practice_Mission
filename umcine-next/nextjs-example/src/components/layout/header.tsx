"use client";

import NextImage from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const pathname = usePathname();
  const navClass = (active: boolean) =>
    cn(
      "whitespace-nowrap text-sm",
      active
        ? "font-bold text-[#181a20] underline underline-offset-8"
        : "text-[#555d6b]",
    );
  return (
    <header className="h-22.75 shrink-0 border-b border-[#e2e5eb] bg-white">
      <div className="mx-auto flex h-full w-[calc(100%-40px)] max-w-320 items-center gap-3 sm:gap-8 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="UMCine 영화 목록"
        >
          <NextImage width={32} height={32} src="/movie-icons/movie.svg" alt="" className="h-8 w-8" />
          <strong className="text-xl font-extrabold tracking-tight">
            UMCine
          </strong>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-3 sm:gap-8">
          <Link
            href="/"
            className={navClass(
              pathname === "/" || pathname.startsWith("/movies/"),
            )}
          >
            영화
          </Link>
          <Link
            href="/search"
            className={navClass(pathname === "/search")}
          >
            검색
          </Link>
          <Link
            href="/profile"
            className={navClass(
              pathname === "/profile" || pathname === "/profile/edit",
            )}
          >
            내 정보
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            aria-label="영화 검색"
            className="hidden h-11 w-11 items-center justify-center rounded-lg border border-[#e2e5eb] sm:flex"
          >
            <NextImage width={32} height={32} src="/movie-icons/search.svg" alt="" className="h-5 w-5" />
          </Link>
          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-11 shrink-0 items-center whitespace-nowrap rounded-lg bg-[#2864fa] px-2.5 text-xs font-bold text-white sm:px-5 sm:text-sm"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              role="status"
              aria-label="내 정보 불러오는 중"
              className="hidden h-11 w-24 animate-pulse rounded-lg bg-gray-200 sm:block"
            />
          ) : (
            <Link
              href="/profile"
              className="hidden h-11 items-center rounded-lg bg-[#2864fa] px-5 text-sm font-bold text-white sm:flex"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
