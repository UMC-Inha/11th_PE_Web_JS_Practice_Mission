import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
}: PaginationProps) {
  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const pages = Array.from(
    { length: Math.max(0, Math.min(5, totalPages - startPage + 1)) },
    (_, index) => startPage + index,
  );

  if (totalPages === 0) {
    return null;
  }

  return (
    <nav
      className="flex h-9 w-full items-center justify-center gap-3"
      aria-label="페이지 번호"
    >
      <button
        type="button"
        disabled={!onPageChange || currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        aria-label="이전 페이지"
        className="group flex h-9 w-9 cursor-pointer items-center justify-center disabled:cursor-default"
      >
        <img
          src="/icons/chevron-left.svg"
          alt=""
          className="h-5 w-5 opacity-50 group-disabled:opacity-20"
        />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          disabled={!onPageChange}
          onClick={() => onPageChange?.(page)}
          aria-label={`${page}페이지`}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "h-9 w-9 cursor-pointer rounded-md text-sm font-semibold disabled:cursor-default",
            page === currentPage
              ? "bg-[#191B20] text-white"
              : "text-gray-500",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={!onPageChange || currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        aria-label="다음 페이지"
        className="group flex h-9 w-9 cursor-pointer items-center justify-center disabled:cursor-default"
      >
        <img
          src="/icons/chevron-right.svg"
          alt=""
          className="h-5 w-5 opacity-50 group-disabled:opacity-20"
        />
      </button>
    </nav>
  );
}