import { Suspense } from "react";
import Link from "next/link";
import { HeaderAuthMenu } from "./header-auth-menu";
import { HeaderNav, HeaderNavLinks } from "./header-nav";

// Server Component: 로고와 검색 버튼처럼 바뀌지 않는 부분은 서버에서 그림
// 현재 주소(usePathname)나 로그인 상태가 필요한 부분만 Client Component로 분리
export function Header() {
  return (
    <header className="border-b border-[#E3E6EB] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-20 py-6">
        <div className="flex items-center gap-[42px]">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191E]">
              <img src="/icons/movie.svg" alt="" className="size-6" />
            </span>
            <span className="text-xl leading-6 font-black tracking-[-0.7px] text-[#17191E]">
              UMCine
            </span>
          </Link>

          {/* /movies/[movieId] 처럼 미리 알 수 없는 주소에서는 usePathname이 Suspense를 필요로 함 */}
          <Suspense fallback={<HeaderNavLinks pathname={null} />}>
            <HeaderNav />
          </Suspense>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="영화 검색"
            className="flex size-[42px] items-center justify-center rounded-lg border border-[#E3E6EB] bg-white text-[#606774]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </Link>
          <HeaderAuthMenu />
        </div>
      </div>
    </header>
  );
}
