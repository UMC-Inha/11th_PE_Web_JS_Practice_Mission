import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB는 인기 영화 목록을 최대 500페이지까지만 제공해요.
const MAX_TMDB_PAGES = 500;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, MAX_TMDB_PAGES));
        }
      } catch {
        if (!ignore) {
          setMovies([]);
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  return (
    <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8 pb-16">
      <h1 className="mb-6 text-left text-[28px] font-extrabold text-app-text-h">
        영화 목록
      </h1>
      {isLoading ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert">{errorMessage}</p>
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
