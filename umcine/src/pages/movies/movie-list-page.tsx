import { useNavigate, useSearch } from "@tanstack/react-router";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const PAGE_SIZE = 10;

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedMovies = movies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handlePageChange(nextPage: number) {
    navigate({ search: { page: nextPage > 1 ? nextPage : undefined } });
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] pt-6 pb-[60px]">
      <h2 className="mb-4 text-center text-[30px] font-extrabold">영화 목록</h2>
      <MovieGrid movies={pagedMovies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}