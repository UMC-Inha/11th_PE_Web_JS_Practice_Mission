export default function Footer() {
    return (
      <footer className="site-footer">
        <div className="container footer-inner">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              TMDB
            </a>.
          </p>
        </div>
      </footer>
    );
  }