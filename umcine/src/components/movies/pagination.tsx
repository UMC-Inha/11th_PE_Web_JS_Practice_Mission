import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination(props: PaginationProps) {
  const { currentPage, totalPages, onPageChange } = props;

  const pagesPerGroup = 10;
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      className="mt-10 flex justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 min-w-9 rounded-[6px] border border-[#e2e5eb] bg-white disabled:opacity-50"
      >
        ‹
      </button>

      {pageNumbers.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "h-9 min-w-9 rounded-[6px] border border-[#e2e5eb] bg-white",
            page === currentPage && "border-blue-600 bg-blue-600 text-white",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 min-w-9 rounded-[6px] border border-[#e2e5eb] bg-white disabled:opacity-50"
      >
        ›
      </button>
    </nav>
  );
}
