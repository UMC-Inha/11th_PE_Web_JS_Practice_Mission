interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200"
      >
        <img
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
          className="size-4"
        />
      </button>

      <span className="text-[15px] font-semibold text-gray-900">{page}</span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200"
      >
        <img
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
          className="size-4"
        />
      </button>
    </nav>
  );
}
