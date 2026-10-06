export function Footer() {
  return (
    <footer className="relative flex h-[57px] w-full shrink-0 items-center justify-center bg-white">
      <div className="absolute right-20 flex items-center gap-2 font-[Pretendard,sans-serif] text-xs text-[#606774]">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-6 w-6"
        />

        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <u>TMDB</u>.
        </span>
      </div>
    </footer>
  );
}