import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  const [page, setPage] = useState(1);

const moviesQuery = useQuery({
  queryKey: ["movies", "list", { page }],
  queryFn: () => getMovies({ page }),
});

const movies = moviesQuery.data?.results ?? [];
const totalPages = moviesQuery.data?.total_pages ?? 0;

const handlePageChange = (nextPage: number) => {
  setPage(nextPage);
};

  return (
    <div className="flex flex-1 flex-col bg-[#f9f9f9]">
      <main className="mx-auto w-[calc(100%-160px)] max-w-7xl flex-1 pt-9.5 pb-14.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:pt-8 max-[720px]:pb-16">
        <div className="mb-4.5 max-[720px]:mb-7">
          <h1 className="m-0 text-[28px] font-bold tracking-[-1px] text-[#171717]">
            영화 목록
          </h1>
        </div>
        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
             />
          </>
        )}
      </main>
    </div>
  );
}
