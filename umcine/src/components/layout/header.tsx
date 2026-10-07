import { Link } from "@tanstack/react-router";

// CSS Module(header.module.css)에서 Tailwind 유틸리티 클래스로 전환
// 반응형: 모바일 우선. 기본값이 모바일, sm:(640px~)부터 데스크톱 값으로 덮어씀
export function Header() {
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

        {/* 내 정보 탭 (필요시 라우트 생성 후 Link로 변경 가능) */}
        <button type="button" className="text-[15px] text-gray-500">
          내 정보
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* 돋보기 아이콘도 검색 페이지 링크로 전환 */}
        <Link to="/search" className="flex items-center justify-center">
          <img src="/icons/search.svg" alt="검색" className="size-5" />
        </Link>
        <button
          type="button"
          className="cursor-pointer rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white sm:px-5 sm:text-[15px]"
        >
          마이페이지
        </button>
      </div>
    </header>
  );
}
