const PAGES = [1, 2, 3, 4, 5];

export default function Pagination() {
  return (
    <nav className="pagination">
      {PAGES.map((page) => (
        <button
          key={page}
          className={page === 1 ? "pagination__button is-active" : "pagination__button"}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}