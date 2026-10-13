import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import { Footer } from "../../components/layout/footer";

export function MovieListPage() {
  const movies = initialMovies;

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex w-full flex-1 flex-col gap-5 px-20 py-6">
        <h1 className="m-0  text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
          영화 목록
        </h1>

        <MovieGrid movies={movies} />

        <Pagination />
      </main>

      <Footer />
    </div>
  );
}