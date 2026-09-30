import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import "../../App.css"; // 임시: Tailwind로 다 옮긴 뒤 삭제

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app">
      <main className="page">
        <h2 className="page__title">영화 목록</h2>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
    </div>
  );
}