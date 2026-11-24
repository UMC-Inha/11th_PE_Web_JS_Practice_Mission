"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const ACTIVE_LINK_CLASS = "font-semibold text-[#111111] underline underline-offset-6";

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

  // "/"는 주소가 딱 같을 때만, 나머지는 그 주소로 시작하면 활성(TanStack의 activeOptions와 같은 규칙)
  const getLinkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return isActive ? ACTIVE_LINK_CLASS : undefined;
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 text-lg font-bold">
            <img src="/icons/movie.svg" alt="" className="h-6 w-6" />
            <span>UMCine</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className={getLinkClass("/")}>
              영화
            </Link>
            <Link href="/search" className={getLinkClass("/search")}>
              검색
            </Link>
            <Link href="/my" className={getLinkClass("/my")}>
              내 정보
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200">
            <img src="/icons/search.svg" alt="검색" className="h-4.5 w-4.5" />
          </button>
          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-9 items-center rounded-lg bg-[#4f5de8] px-4 text-sm font-semibold text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              href="/my"
              className="flex h-9 items-center rounded-lg bg-[#4f5de8] px-4 text-sm font-semibold text-white"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}