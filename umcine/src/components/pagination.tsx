export default function Pagination() {
    const pages = [1, 2, 3, 4, 5];
  
    return (
      <nav className="pagination" aria-label="페이지 번호">
        <button type="button" className="page-arrow" aria-label="이전 페이지" disabled>
          <img src="/icons/chevron-left.svg" alt="" />
        </button>
  
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={page === 1 ? "page-button active" : "page-button"}
            aria-current={page === 1 ? "page" : undefined}
          >
            {page}
          </button>
        ))}
  
        <button type="button" className="page-arrow" aria-label="다음 페이지" disabled>
          <img src="/icons/chevron-right.svg" alt="" />
        </button>
      </nav>
    );
  }