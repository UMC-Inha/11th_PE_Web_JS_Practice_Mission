import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const pagedMovies = movies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  );

  return (
    <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8 pb-16">
      <h1 className="mb-6 text-left text-[28px] font-extrabold text-app-text-h">
        영화 목록
      </h1>
      <MovieGrid movies={pagedMovies} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
}
