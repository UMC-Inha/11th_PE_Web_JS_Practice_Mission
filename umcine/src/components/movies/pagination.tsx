import { cn } from "../../utils/cn";

const PAGES = [1, 2, 3, 4, 5];

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pageNumbers = PAGES.filter((pageNumber) => pageNumber <= totalPages);

  return (
    <nav className="mt-12 flex justify-center gap-2">
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={cn(
            "h-9 w-9 cursor-pointer rounded-lg",
            pageNumber === page ? "bg-[#4f5de8] text-white" : "text-gray-500",
          )}
        >
          {pageNumber}
        </button>
      ))}
    </nav>
  );
}