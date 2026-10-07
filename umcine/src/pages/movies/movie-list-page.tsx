import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMovies } from "../../contexts/movie-context";

export function MovieListPage() {
  const {
    movies,
    handleToggleBookmark,
  } = useMovies();

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-10 pt-8 pb-14">
      <h1 className="mb-6 text-4xl font-bold tracking-tight">
        영화 목록
      </h1>

      <MovieGrid
        movies={movies}
        onToggleBookmark={
          handleToggleBookmark
        }
      />

      <Pagination />
    </main>
  );
}