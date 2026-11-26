"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

// CSS Module(header.module.css)에서 Tailwind 유틸리티 클래스로 전환
// 반응형: 모바일 우선. 기본값이 모바일, sm:(640px~)부터 데스크톱 값으로 덮어씀
// TanStack의 activeProps 대체: 현재 경로(usePathname)와 탭 경로를 직접 비교해 활성 여부를 판단한다.
// "/"는 정확히 일치할 때만, 나머지는 하위 경로(/me/edit 등)도 활성으로 본다.
function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const TAB_BASE = "text-[15px] no-underline";
const tabClass = (active: boolean) =>
  `${TAB_BASE} ${active ? "font-semibold text-gray-900" : "text-gray-500"}`;

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
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-8 sm:py-4">
      <div className="flex items-center gap-4 sm:gap-8">
        {/* 홈으로 이동하는 로고 링크 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline"
        >
          <img
            src="/icons/movie.svg"
            alt="UMCINE 로고"
            className="box-content size-5 rounded-lg border-[1.5px] border-gray-900 p-1.5"
          />
          {/* 좁은 화면에서는 로고 글자를 숨겨 공간 확보 */}
          <span className="hidden sm:inline">UMCine</span>
        </Link>

        {/* 영화 탭 */}
        <Link href="/" className={tabClass(isActivePath(pathname, "/"))}>
          영화
        </Link>

        {/* 검색 탭 */}
        <Link href="/search" className={tabClass(isActivePath(pathname, "/search"))}>
          검색
        </Link>

        <Link href="/me" className={tabClass(isActivePath(pathname, "/me"))}>
          내 정보
        </Link>
      </div>

      {!accessToken ? (
      <Link
        href="/login"
        className="cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white no-underline sm:px-5 sm:text-[15px]"
      >
        로그인
      </Link>
    ) : meQuery.isLoading ? (
      <span className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
    ) : (
      <Link
        href="/me"
        className="cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white no-underline sm:px-5 sm:text-[15px]"
      >
        마이페이지
      </Link>
    )}
    </header>
  );
}
