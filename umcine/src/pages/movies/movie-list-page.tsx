import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";

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
    <>
      {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인해요. */}
      {moviesQuery.isPending ? (
        <p className="p-8 text-gray-500">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="p-8 text-red-500">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="p-8 text-gray-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid
          movies={movies}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </>
      )}
    </>
  );
}
