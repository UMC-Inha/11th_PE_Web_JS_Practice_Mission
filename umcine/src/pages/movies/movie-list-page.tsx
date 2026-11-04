import { useEffect, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-[#f9f9f9]">
      <main className="mx-auto w-[calc(100%-160px)] max-w-7xl flex-1 pt-9.5 pb-14.5 max-[720px]:w-[calc(100%-40px)] max-[720px]:pt-8 max-[720px]:pb-16">
        <div className="mb-4.5 max-[720px]:mb-7">
          <h1 className="m-0 text-[28px] font-bold tracking-[-1px] text-[#171717]">
            영화 목록
          </h1>
        </div>
        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p role="alert">{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination currentPage={1} totalPages={3} />
          </>
        )}
      </main>
    </div>
  );
}
