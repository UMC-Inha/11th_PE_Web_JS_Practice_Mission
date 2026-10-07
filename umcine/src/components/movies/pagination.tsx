import { cn } from "../../utils/cn";

export default function Pagination() {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav
      className="mt-9 flex items-center justify-center gap-2"
      aria-label="페이지 번호"
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center"
        aria-label="이전 페이지"
        disabled
      >
        <img
          className="h-6 w-6 opacity-25"
          src="/icons/chevron-left.svg"
          alt=""
        />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          disabled
          className={cn(
            "h-9 w-9 rounded-lg text-sm",
            page === 1
              ? "bg-[#191b20] text-white"
              : "text-gray-500",
          )}
          aria-current={
            page === 1
              ? "page"
              : undefined
          }
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center"
        aria-label="다음 페이지"
        disabled
      >
        <img
          className="h-6 w-6 opacity-25"
          src="/icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}