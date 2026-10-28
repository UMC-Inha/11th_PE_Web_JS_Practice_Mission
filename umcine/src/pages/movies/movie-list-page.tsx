import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";


export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <main className="mx-auto w-[90%] max-w-320 flex-1 py-8">
        <h1 className="mb-5 text-2xl font-bold">영화 목록</h1>

        <MovieGrid
          movies={movies}

        />
      </main>

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
