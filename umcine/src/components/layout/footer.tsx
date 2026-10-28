export function Footer() {
  return (
    <footer className="border-t border-[#E3E6EB] bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-2 px-20 py-4">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt=""
          className="h-3 w-auto shrink-0"
        />
        <p className="text-xs leading-[14px] text-[#606774]">
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
        </p>
      </div>
    </footer>
  );
}
