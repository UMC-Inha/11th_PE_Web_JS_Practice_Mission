import { useEffect, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [movieList, setMovieList] = useState<Movie[]>(() => {
    
    const bookmarkedIds = readBookmarkIds();

    return movies.map((movie) => ({
      ...movie,
      isBookmarked: bookmarkedIds.includes(movie.id),
    }));
  });

  useEffect(() => {
      const bookmarkedIds = movieList
          .filter((movie) => movie.isBookmarked)
          .map((movie) => movie.id);
      
      saveBookmarkIds(bookmarkedIds);
    }, [movieList]);

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
    <div className="flex flex-1 flex-col bg-[#f9f9f9]">
      <main className="mx-auto w-[calc(100%-160px)] max-w-7xl flex-1 pt-9.5 pb-14.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:pt-8 max-[720px]:pb-16">
        <div className="mb-4.5 max-[720px]:mb-7">
          <h1 className="m-0 text-[28px] font-bold tracking-[-1px] text-[#171717]">영화 목록</h1>
        </div>
        <MovieGrid
          movies={movieList}
          onBookmarkToggle={handleBookmarkToggle}
        />
        <Pagination currentPage={1} totalPages={3} />
      </main>
    </div>
  );
}
