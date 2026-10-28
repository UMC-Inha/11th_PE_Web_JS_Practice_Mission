import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

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

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [page]);

  function handlePageChange(nextPage: number) {
    navigate({ search: { page: nextPage > 1 ? nextPage : undefined } });
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] pt-6 pb-[60px]">
      <h2 className="mb-4 text-center text-[30px] font-extrabold">영화 목록</h2>

      {isLoading ? (
        <p className="py-20 text-center text-sm text-[#888]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <p className="py-20 text-center text-sm text-[#888]">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-sm text-[#888]">
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