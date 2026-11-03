import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

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
    <main id="movies" className="mx-auto w-[89%] py-8">
      <h1 className="mb-6 text-[32px] font-bold">인기 영화</h1>
      {moviesQuery.isPending ? (
        <p role="status" className="py-20 text-center text-[#969DA8]">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role="alert" className="py-20 text-center text-red-500">{moviesQuery.error.message}</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-[#969DA8]">표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: getTmdbPosterUrl(movie.poster_path),
            releaseDate: movie.release_date,
          }))}
        />
      )}
      {!moviesQuery.isPending && !moviesQuery.isError && movies.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
