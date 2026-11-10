import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movieListQueryOptions } from "../../queries/movie-queries";

// TMDB는 인기 영화 목록을 최대 500페이지까지만 제공해요.
const MAX_TMDB_PAGES = 500;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending, isError } = useQuery(
    movieListQueryOptions(currentPage),
  );
  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, MAX_TMDB_PAGES);

  return (
    <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8 pb-16">
      <h1 className="mb-6 text-left text-[28px] font-extrabold text-app-text-h">
        영화 목록
      </h1>
      {isPending ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : isError ? (
        <p role="alert">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
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
