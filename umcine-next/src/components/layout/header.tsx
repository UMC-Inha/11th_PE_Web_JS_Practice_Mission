"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export default function Header() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogout = () => {
    setAccessToken(null);
    router.replace("/login");
  };

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const pathname = usePathname();

  const isMovieRoute =
    pathname === "/" || pathname.startsWith("/movies/");

  const isSearchRoute = pathname.startsWith("/search");

  const isMyPageRoute = pathname.startsWith("/mypage");

  return (
    <header className="h-[91px] w-full shrink-0 border-b border-gray-200 bg-white">
      <div className="flex h-full w-full items-center justify-between px-5 py-6 xl:px-20">
        <div className="flex h-full items-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-[22px] font-extrabold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#191B20]">
              <Image
                src="/icons/movie.svg"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </span>

            UMCine
          </Link>

          <nav
            className="ml-10 flex items-center gap-8 text-sm font-semibold text-gray-500"
            aria-label="주 메뉴"
          >
            <Link
              href="/"
              className={cn(
                "underline-offset-4",
                isMovieRoute && "font-bold text-[#191B20] underline",
              )}
            >
              영화
            </Link>

            <Link
              href="/search"
              className={cn(
                "underline-offset-4",
                isSearchRoute && "font-bold text-[#191B20] underline",
              )}
            >
              검색
            </Link>

            <Link
              href="/mypage"
              className={cn(
                "underline-offset-4",
                isMyPageRoute && "font-bold text-[#191B20] underline",
              )}
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="검색"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 opacity-60"
            />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white"
            >
              로그인
            </Link>
          ) : (
            <>
              {meQuery.isLoading ? (
                <span
                  role="status"
                  aria-label="회원 정보 불러오는 중"
                  className="h-11 w-24 animate-pulse rounded-lg bg-gray-200"
                />
              ) : (
                <Link
                  href="/mypage"
                  className="flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white"
                >
                  마이페이지
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700"
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
