import styles from "./header.module.css";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* 홈으로 이동하는 로고 링크 */}
        <Link to="/" className={styles.logoButton}> {/*SPA방식으로 주소와 본문(<Outlet />)을 교체*/}
          <img
            src="/icons/movie.svg"
            alt="UMCINE 로고"
            className={styles.logoIcon}
          />
          UMCine
        </Link>

        {/* 영화 탭 */}
        <Link
          to="/"
          className={styles.navButton}
          activeProps={{
            className: `${styles.navButton} ${styles.navButtonActive}`,
          }}
          // 현재 주소가 '/'일 때만 이 클래스들이 추가로 적용됨
        >
          영화
        </Link>

        {/* 검색 탭 */}
        <Link
          to="/search"
          className={styles.navButton}
          activeProps={{
            className: `${styles.navButton} ${styles.navButtonActive}`,
          }}
        >
          검색
        </Link>

        {/* 내 정보 탭 (필요시 라우트 생성 후 Link로 변경 가능) */}
        <button type="button" className={styles.navButton}>
          내 정보
        </button>
      </div>

      <div className={styles.right}>
        {/* 돋보기 아이콘도 검색 페이지 링크로 전환 */}
        <Link to="/search" className={styles.searchButton}>
          <img
            src="/icons/search.svg"
            alt="검색"
            className={styles.searchIcon}
          />
        </Link>
        <button type="button" className={styles.primaryButton}>
          마이페이지
        </button>
      </div>
    </header>
  );
}