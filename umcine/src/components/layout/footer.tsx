import "../../App.css"

export function Footer() {
    return(
        <footer className="min-h-8 border-t border-[#e7e7e7] bg-white px-20 py-2 text-[8px] text-[#8c8c8c] max-[720px]:px-5">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-1.5 max-[720px]:justify-center max-[720px]:text-center">
          <img className="h-auto w-5.5" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </span>
        </div>
      </footer>
    )
}