import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

// CSS Module(header.module.css)에서 Tailwind 유틸리티 클래스로 전환
// 반응형: 모바일 우선. 기본값이 모바일, sm:(640px~)부터 데스크톱 값으로 덮어씀
export function Header() {
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
          to="/"
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
        <Link
          to="/"
          className="text-[15px] text-gray-500 no-underline"
          activeProps={{
            className: "text-[15px] font-semibold text-gray-900 no-underline",
          }}
          // 현재 주소가 '/'일 때만 이 클래스들이 추가로 적용됨
        >
          영화
        </Link>

        {/* 검색 탭 */}
        <Link
          to="/search"
          className="text-[15px] text-gray-500 no-underline"
          activeProps={{
            className: "text-[15px] font-semibold text-gray-900 no-underline",
          }}
        >
          검색
        </Link>

        <Link
          to="/me"
          className="text-[15px] text-gray-500 no-underline"
          activeProps={{
            className: "text-[15px] font-semibold text-gray-900 no-underline",
          }}
        >
          내 정보
        </Link>
      </div>

      {!accessToken ? (
      <Link
        to="/login"
        className="cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white no-underline sm:px-5 sm:text-[15px]"
      >
        로그인
      </Link>
    ) : meQuery.isLoading ? (
      <span className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
    ) : (
      <Link
        to="/me"
        className="cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white no-underline sm:px-5 sm:text-[15px]"
      >
        마이페이지
      </Link>
    )}
    </header>
  );
}
