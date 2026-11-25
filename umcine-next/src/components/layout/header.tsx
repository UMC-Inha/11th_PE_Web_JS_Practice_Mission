"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const navLinkClass = "cursor-pointer text-[13px] text-[#555]";
const activeNavLinkClass =
  "font-bold text-[#111] underline underline-offset-[5px]";
const authButtonClass =
  "flex h-[34px] cursor-pointer items-center rounded-md bg-[#2563EB] px-3.5 text-[13px] font-bold text-white";

export function Header() {
  const pathname = usePathname() ?? "";
  const accessToken = useAuthStore((state) => state.accessToken);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: isMounted && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchActive = pathname === "/search";
  const isMyActive = pathname.startsWith("/my");

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-[76px] w-[min(1080px,100%_-_48px)] items-center gap-9">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold text-[#111]"
        >
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <span>UMCine</span>
        </Link>

        <nav className="flex gap-6" aria-label="주요 메뉴">
          <Link
            href="/"
            className={cn(navLinkClass, isMoviesActive && activeNavLinkClass)}
          >
            영화
          </Link>
          <Link
            href="/search"
            className={cn(navLinkClass, isSearchActive && activeNavLinkClass)}
          >
            검색
          </Link>
          <Link
            href="/my"
            className={cn(navLinkClass, isMyActive && activeNavLinkClass)}
          >
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="검색"
            className="grid size-9 place-items-center rounded-lg border border-[#e5e7eb] bg-white"
          >
            <img src="/icons/search.svg" alt="" className="size-[18px]" />
          </Link>

          {!isMounted ? (
            <span className="h-[34px] w-[74px] rounded-md bg-gray-200" />
          ) : !accessToken ? (
            <Link href="/login" className={authButtonClass}>
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-[34px] w-[74px] animate-pulse rounded-md bg-gray-200" />
          ) : (
            <Link href="/my" className={authButtonClass}>
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}