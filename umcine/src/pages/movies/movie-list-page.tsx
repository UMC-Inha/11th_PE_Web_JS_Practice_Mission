import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  const { page: searchPage } = useSearch({ from: "/" });
  const page = searchPage ?? 1;
  const navigate = useNavigate({ from: "/" });

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const handlePageChange = (nextPage: number) => {
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > totalPages) return;
    void navigate({
      search: nextPage === 1 ? {} : { page: nextPage },
    });
  };

  return (
    <>
      <main className="mx-auto w-[90%] max-w-320 flex-1 py-8">
        <h1 className="mb-5 text-2xl font-bold">영화 목록</h1>
        {moviesQuery.isPending ? (
          <p role="status">영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </main>
      {moviesQuery.isSuccess && movies.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

