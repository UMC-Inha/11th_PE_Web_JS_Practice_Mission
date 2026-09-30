import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const buttonClass =
  "grid size-9 cursor-pointer place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[13px] text-[#555] disabled:cursor-not-allowed disabled:opacity-40";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={buttonClass}
      >
        <img src="/icons/chevron-left.svg" alt="" className="size-4" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              buttonClass,
              isActive && "border-[#4b5ee4] bg-[#4b5ee4] font-bold text-white",
            )}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={buttonClass}
      >
        <img src="/icons/chevron-right.svg" alt="" className="size-4" />
      </button>
    </nav>
  );
}