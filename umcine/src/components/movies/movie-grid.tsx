import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import { MovieCard } from "./movie-card";
import { Pagination } from "./pagination";
import styles from "./movie-grid.module.css";

export function MovieGrid() {
  const [movies, setMovies] = useState(initialMovies);

  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>영화 목록</h2>

      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>

      <Pagination />
    </section>
  );
}
