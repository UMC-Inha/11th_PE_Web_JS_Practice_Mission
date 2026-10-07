export default function Footer() {
  return (
    <footer className="flex min-h-14 flex-wrap items-center justify-end gap-2 border-t border-[#e2e5eb] bg-white px-[5.5%] py-4 text-xs text-[#6b7280]">
      <span className="font-extrabold tracking-wide text-[#21b8c7]">TMDB</span>
      <p>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a href="https://www.themoviedb.org/" className="underline underline-offset-2">TMDB</a>.
      </p>
    </footer>
  );
}
