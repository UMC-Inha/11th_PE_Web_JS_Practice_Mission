import { cn } from "../../utils/cn";

export default function Pagination() {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav
      className="flex h-9 w-full items-center justify-center gap-3"
      aria-label="페이지 번호"
    >
      <button
        type="button"
        disabled
        aria-label="이전 페이지"
        className="flex h-9 w-9 cursor-default items-center justify-center"
      >
        <img
          src="/icons/chevron-left.svg"
          alt=""
          className="h-5 w-5 opacity-20"
        />
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
        aria-label="다음 페이지"
        className="flex h-9 w-9 cursor-default items-center justify-center"
      >
        <img
          src="/icons/chevron-right.svg"
          alt=""
          className="h-5 w-5 opacity-50"
        />
      </button>
    </nav>
  );
}