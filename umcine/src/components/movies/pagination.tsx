export default function Pagination() {
  return (
    <div className="pagination">
      <button className="pagination-button" type="button">
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>

      <button className="pagination-page active" type="button">
        1
      </button>

      <button className="pagination-page" type="button">
        2
      </button>

      <button className="pagination-page" type="button">
        3
      </button>

      <button className="pagination-page" type="button">
        4
      </button>

      <button className="pagination-page" type="button">
        5
      </button>

      <button className="pagination-button" type="button">
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </div>
  );
}