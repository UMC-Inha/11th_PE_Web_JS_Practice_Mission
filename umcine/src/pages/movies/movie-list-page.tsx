import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="mx-auto w-full max-w-360 flex-1 px-20 py-12">
      <h2 className="mb-6 text-[32px] font-bold">영화 목록</h2>
      <MovieGrid movies={movies} />
      <Pagination />
    </main>
  );
}