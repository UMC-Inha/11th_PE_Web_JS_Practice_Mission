export function Footer() {
  return (
    <footer className="mt-auto flex min-h-14.25 shrink-0 items-center border-t border-[#e2e5eb] bg-white py-3">
      <div className="mx-auto flex w-[calc(100%-40px)] max-w-320 items-center justify-end gap-2 text-[11px] text-[#677080] md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-7 shrink-0" />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}
