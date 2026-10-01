import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieGrid({ movies, onBookmarkToggle }: MovieGridProps) {
  return (
    <section
      id="movie-list"
      className="grid grid-cols-5 gap-x-[18px] gap-y-[22px] max-[720px]:grid-cols-2 max-[720px]:gap-x-4 max-[720px]:gap-y-7"
      aria-label="영화 목록">
      {movies.map((movie) => <MovieCard key={movie.id} movie={movie} onBookmarkToggle={onBookmarkToggle} />)}
    </section>
  );
}
