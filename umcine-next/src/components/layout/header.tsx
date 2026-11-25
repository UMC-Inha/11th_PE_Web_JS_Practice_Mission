"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const pathname = usePathname();

  const isMoviePage =
    pathname === "/" || pathname.startsWith("/movies/");

  const isSearchPage = pathname === "/search";

  const isMyPage =
    pathname === "/mypage" || pathname.startsWith("/mypage/");

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="h-[91px] w-full border-b border-[#e3e6eb] bg-white">
      <div className="flex h-full w-full items-center justify-between px-20 py-6">
        <div className="flex items-center gap-[42px]">
          <Link
            href="/"
            className="flex items-center gap-[10px] text-xl font-black tracking-[-0.7px] text-[#17191e]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
              <img
                src="/icons/movie.svg"
                alt=""
                className="h-6 w-6"
              />
            </span>

            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-[30px] text-sm font-bold">
            <Link
              href="/"
              className={
                isMoviePage
                  ? "text-[#17191e] underline underline-offset-4"
                  : "text-[#606774]"
              }
            >
              영화
            </Link>

            <Link
              href="/search"
              className={
                isSearchPage
                  ? "text-[#17191e] underline underline-offset-4"
                  : "text-[#606774]"
              }
            >
              검색
            </Link>

            <Link
              href="/mypage"
              className={
                isMyPage
                  ? "text-[#17191e] underline underline-offset-4"
                  : "text-[#606774]"
              }
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-[10px]">
          <Link
            href="/search"
            aria-label="영화 검색"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-6 w-6"
            />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              href="/mypage"
              className="flex h-[42px] items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-sm font-extrabold text-white"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}