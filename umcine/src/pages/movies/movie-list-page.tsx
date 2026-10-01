import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  function handleBookmarkToggle(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      <main className="mx-auto w-[calc(100%-160px)] max-w-[1280px] flex-1 pt-[38px] pb-[58px] max-[720px]:w-[calc(100%-40px)] max-[720px]:pt-8 max-[720px]:pb-16">
        <div className="mb-[18px] max-[720px]:mb-7">
          <h1 className="m-0 text-[28px] font-bold tracking-[-1px] text-[#171717]">영화 목록</h1>
        </div>
        <MovieGrid
          movies={movieList}
          onBookmarkToggle={handleBookmarkToggle}
        />
        <Pagination currentPage={1} totalPages={3} />
      </main>

      <footer className="min-h-8 border-t border-[#e7e7e7] bg-white px-20 py-2 text-[8px] text-[#8c8c8c] max-[720px]:px-5">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-end gap-[6px] max-[720px]:justify-center max-[720px]:text-center">
          <img className="h-auto w-[22px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </span>
        </div>
      </footer>
    </div>
  );
}
