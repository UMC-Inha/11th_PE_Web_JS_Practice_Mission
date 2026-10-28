export function Footer() {
  return (
    <footer className="border-t border-[#E3E6EB] bg-white px-20 py-4">
      <p className="flex items-center justify-end gap-2 text-xs text-[#6b7280]">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3.5" />
        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </span>
      </p>
    </footer>
  );
}