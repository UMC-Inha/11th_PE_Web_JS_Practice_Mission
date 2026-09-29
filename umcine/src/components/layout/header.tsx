import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button type="button" className={styles.logoButton}>
          <img
            src="/icons/movie.svg"
            alt="UMCINE 로고"
            className={styles.logoIcon}
          />
          UMCine
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonActive}`}
        >
          영화
        </button>
        <button type="button" className={styles.navButton}>
          검색
        </button>
        <button type="button" className={styles.navButton}>
          내 정보
        </button>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.searchButton}>
          <img
            src="/icons/search.svg"
            alt="검색"
            className={styles.searchIcon}
          />
        </button>
        <button type="button" className={styles.primaryButton}>
          마이페이지
        </button>
      </div>
    </header>
  );
}
