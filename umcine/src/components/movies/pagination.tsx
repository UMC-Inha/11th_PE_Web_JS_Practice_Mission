import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const buttonClass = "flex h-8 min-w-8 items-center justify-center rounded px-2";
  return (
    <nav className="mb-5 flex items-center justify-center gap-1" aria-label="페이지 이동">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        className={cn(buttonClass, currentPage <= 1 && "cursor-not-allowed opacity-40")}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/movie-icons/chevron-left.svg" alt="" className="h-4 w-4" />
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => startPage + index).map((page) => (
        <button
          key={page}
          type="button"
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            buttonClass,
            currentPage === page ? "bg-[#2864fa] text-white" : "text-[#555]",
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        className={cn(buttonClass, currentPage >= totalPages && "cursor-not-allowed opacity-40")}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/movie-icons/chevron-right.svg" alt="" className="h-4 w-4" />
      </button>
    </nav>
  );
}