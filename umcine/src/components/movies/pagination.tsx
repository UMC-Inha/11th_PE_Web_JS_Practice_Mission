import { cn } from "../../utils/cn";

const arrowButtonClass =
  "flex h-8 min-w-8 items-center justify-center rounded-md border-none bg-transparent px-1 disabled:cursor-not-allowed disabled:opacity-35";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className={arrowButtonClass}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <img
          className="h-4 w-4 opacity-70"
          src="/icons/chevron-left.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
      <ul className="m-0 flex list-none items-center gap-1 p-0">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-md border-none bg-transparent px-1 text-sm text-app-text",
                page === currentPage && "bg-app-accent font-bold text-white",
              )}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={arrowButtonClass}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <img
          className="h-4 w-4 opacity-70"
          src="/icons/chevron-right.svg"
          alt=""
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}

export default Pagination;
