// CSS Module(pagination.module.css)에서 Tailwind 유틸리티 클래스로 전환
export function Pagination() {
  return (
    <nav className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200"
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="size-4"
        />
      </button>

      <span className="text-[15px] font-semibold text-gray-900">1</span>

      <button
        type="button"
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200"
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="size-4"
        />
      </button>
    </nav>
  );
}
