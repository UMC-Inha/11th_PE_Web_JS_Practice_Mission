export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-5">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-end gap-2.5 px-5 lg:px-20">
        <img
          className="w-[72px]"
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
        />

        <p className="text-xs text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="underline"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>.
        </p>
      </div>
    </footer>
  );
}