import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(() => readBookmarkIds());

  function handleToggleBookmark(movieId: number) {
    const nextIds = bookmarkedMovieIds.includes(movieId)
      ? bookmarkedMovieIds.filter((id) => id !== movieId)
      : [...bookmarkedMovieIds, movieId];

    setBookmarkedMovieIds(nextIds);
    saveBookmarkIds(nextIds);
  }

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="mx-auto w-full max-w-360 flex-1 px-20 py-12">
      <h2 className="mb-6 text-[32px] font-bold">영화 목록</h2>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}