function Footer() {
  return (
    <footer className="mt-auto border-t border-app-border">
      <div className="mx-auto flex max-w-[1126px] items-center justify-end gap-2.5 px-6 py-5">
        <img
          className="h-3.5 w-auto"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />
        <p className="text-xs text-app-text">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="underline"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

export default Footer;
