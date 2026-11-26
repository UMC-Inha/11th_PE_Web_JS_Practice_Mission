// CSS Module(footer.module.css)에서 Tailwind 유틸리티 클래스로 전환
export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-5 sm:justify-end sm:px-8">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="TMDB"
        className="size-6 object-contain"
      />
      <p className="m-0 text-xs text-gray-500 sm:text-sm">
        This product uses the TMDB API but is not endorsed or certified by
        TMDB.
      </p>
    </footer>
  );
}
