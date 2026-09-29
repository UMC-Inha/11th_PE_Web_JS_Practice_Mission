import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
        <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
        className={styles.image}
      />
      <p className={styles.text}>
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
      
    </footer>
  );
}
