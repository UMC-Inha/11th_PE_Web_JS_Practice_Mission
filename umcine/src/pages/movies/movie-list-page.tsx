import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-5 py-6 xl:min-h-[846px] xl:px-20">
      <h1 className="h-11 text-4xl leading-[44px] font-bold tracking-tight">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <p role="status" className="py-12 text-sm text-gray-500">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p role="alert" className="py-12 text-sm text-red-600">
          {moviesQuery.error.message || "영화 목록을 불러오지 못했어요."}
        </p>
      ) : movies.length === 0 ? (
        <p className="py-12 text-sm text-gray-500">
          조건에 맞는 영화가 없어요.
        </p>
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
  );
}