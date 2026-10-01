interface PaginationProps { currentPage: number; totalPages: number; }

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지" disabled><img src="/icons/chevron-left.svg" alt="" /></button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button key={page} className={page === currentPage ? "is-current" : undefined} type="button" aria-label={`${page}페이지`} aria-current={page === currentPage ? "page" : undefined}>{page}</button>
      ))}
      <button type="button" aria-label="다음 페이지"><img src="/icons/chevron-right.svg" alt="" /></button>
    </nav>
  );
}
