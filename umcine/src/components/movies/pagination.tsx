import { cn } from "../../utils/cn";

export default function Pagination() {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="페이지 번호"
    >
      <button
        type="button"
        disabled
        className="flex h-9 w-9 cursor-default items-center justify-center text-lg text-blue-200"
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          disabled
          aria-current={
            page === 1
              ? "page"
              : undefined
          }
          className={cn(
            "h-9 w-9 cursor-default rounded-md text-sm font-semibold",
            page === 1
              ? "bg-[#191B20] text-white"
              : "text-gray-500",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled
        className="flex h-9 w-9 cursor-default items-center justify-center text-lg text-gray-500"
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}