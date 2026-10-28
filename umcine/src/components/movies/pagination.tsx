import { cn } from "../../utils/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="영화 목록 페이지"
      className="flex items-center justify-center gap-3 self-stretch"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="cursor-pointer text-[#606774] disabled:cursor-default disabled:text-[#D9E5FF]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-[7px] text-[13px] leading-4 font-bold",
              pageNumber === page
                ? "bg-[#17191E] text-white"
                : "text-[#606774]",
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="cursor-pointer text-[#606774] disabled:cursor-default disabled:text-[#D9E5FF]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
    </nav>
  );
}
