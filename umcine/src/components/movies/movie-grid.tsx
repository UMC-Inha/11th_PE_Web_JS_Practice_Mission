import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section
      className="grid w-full grid-cols-1 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:h-[678px] xl:grid-cols-5 xl:grid-rows-2 xl:gap-x-[18px]"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={
            onToggleBookmark
          }
        />
      ))}
    </section>
  );
}