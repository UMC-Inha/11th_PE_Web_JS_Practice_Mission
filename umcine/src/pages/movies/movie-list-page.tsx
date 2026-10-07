import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMovies } from "../../contexts/movie-context";

export function MovieListPage() {
  const {
    movies,
    handleToggleBookmark,
  } = useMovies();

  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-5 py-6 xl:h-[846px] xl:flex-none xl:px-20">
      <h1 className="h-11 text-4xl leading-[44px] font-bold tracking-tight">
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