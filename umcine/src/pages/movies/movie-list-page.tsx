import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  return <MovieListContent key={currentPage} page={currentPage} onPageChange={setCurrentPage} />;
}

function MovieListContent({ page, onPageChange }: { page: number; onPageChange: (page: number) => void }) {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    void loadMovies();
    return () => { ignore = true; };
  }, [page]);

  return (
    <>
      <main className="mx-auto w-[90%] max-w-320 flex-1 py-8">
        <h1 className="mb-5 text-2xl font-bold">영화 목록</h1>
        {isLoading ? <p role="status">영화 목록을 불러오는 중이에요.</p>
          : errorMessage ? <p role="alert">{errorMessage}</p>
          : movies.length === 0 ? <p>조건에 맞는 영화가 없어요.</p>
          : <MovieGrid movies={movies} />}
      </main>
      {!isLoading && !errorMessage && movies.length > 0 && totalPages > 1 &&
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />}
    </>
  );
}