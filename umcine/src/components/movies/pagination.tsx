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
  const buttonClass =
    "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-transparent p-0 text-sm";

  // 현재 페이지가 포함된 5개 페이지 번호 표시
  const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <div className="flex h-9 items-center justify-center gap-1">
      <button
        className={buttonClass}
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="h-6 w-6"
        />
      </button>

      {/* 현재 페이지에 따라 선택된 버튼 스타일 적용 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={cn(
            buttonClass,
            currentPage === page && "bg-[#2563eb] text-white",
          )}
          type="button"
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={buttonClass}
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="h-6 w-6"
        />
      </button>
    </div>
  );
}
