import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import "../../App.css";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 10;
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;

  const currentMovies = movies.slice(
    startIndex,
    startIndex + moviesPerPage,
  );

  return (
    <main className="px-[80px] pt-[24px]">
      <h1
        id="movies"
        className="mb-[20px] h-11 w-fit text-[38px] font-bold leading-[44px] tracking-[-3px]"
      >
        영화 목록
      </h1>

      <MovieGrid
        movies={currentMovies}
      />

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
