import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movies, setMovies] =
    useState<Movie[]>(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  return (
    <main className="container movie-page">
      <h1 className="page-title">영화 목록</h1>

      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination />
    </main>
  );
}