import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
    placeholderData: keepPreviousData,
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  return (
    <main className="mx-auto w-full max-w-360 flex-1 px-20 py-12">
      <h2 className="mb-6 text-[32px] font-bold">영화 목록</h2>
      {moviesQuery.isPending ? (
        <p className="py-24 text-center text-sm text-gray-500">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="py-24 text-center text-sm text-red-500">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="py-24 text-center text-sm text-gray-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}

      {totalPages > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </main>
  );
}