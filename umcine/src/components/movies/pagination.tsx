import styles from "./pagination.module.css";

export function Pagination() {
  return (
    <nav className={styles.pagination}>
      <button type="button" className={styles.arrowButton}>
        <img src="/icons/chevron-left.svg" alt="이전 페이지" />
      </button>

      <span className={styles.page}>1</span>

      <button type="button" className={styles.arrowButton}>
        <img src="/icons/chevron-right.svg" alt="다음 페이지" />
      </button>
    </nav>
  );
}
