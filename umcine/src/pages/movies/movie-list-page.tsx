import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

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
    <main id="movies" className="mx-auto w-[89%] py-8">
      <h1 className="mb-6 text-[32px] font-bold">인기 영화</h1>
      {isLoading ? (
        <p role="status" className="py-20 text-center text-[#969DA8]">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert" className="py-20 text-center text-red-500">{errorMessage}</p>
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
    </main>
  );
}
