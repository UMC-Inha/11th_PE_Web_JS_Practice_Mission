interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (nextPage: number) => void
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const buttonClass =
    'h-9 min-w-9 rounded-md border border-[#e3e6eb] bg-white px-2 text-sm text-[#17191e] hover:border-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40'

  if (totalPages <= 1) {
    return null
  }

  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4))
  const endPage = Math.min(totalPages, startPage + 4)

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  )

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="영화 목록 페이지"
    >
      <button
        className={buttonClass}
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        이전
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={
            pageNumber === page
              ? 'h-9 min-w-9 rounded-md border border-[#2563eb] bg-[#2563eb] px-2 text-sm text-white'
              : buttonClass
          }
          type="button"
          aria-current={pageNumber === page ? 'page' : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className={buttonClass}
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        다음
      </button>
    </nav>
  )
}