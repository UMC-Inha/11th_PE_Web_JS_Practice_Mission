import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);

  const normalizedQuery = query.trim();

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  useEffect(() => {
    let ignore = false;

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main
      className={cn(
        "flex-1",
        normalizedQuery
          ? "mx-auto w-full max-w-7xl px-5 py-10"
          : "flex flex-col items-center justify-center gap-8 px-5",
      )}
    >
      <h1
        className={cn(
          "m-0 font-bold text-[#171717]",
          normalizedQuery ? "mb-6 text-3xl" : "text-center text-4xl",
        )}
      >
        {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-[#222] bg-white px-4 py-3 shadow-sm",
          normalizedQuery ? "w-full" : "w-full max-w-197.5",
        )}
      >
        <img src="/icons/search.svg" alt="" className="size-5" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent outline-none"
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {normalizedQuery && (
          <button
            type="button"
            aria-label="검색어 지우기"
            className="grid size-6 place-items-center"
            onClick={() => {
              setSearchText("");
              navigate({ search: {} });
            }}
          >
            <img src="/icons/close.svg" alt="" className="size-4" />
          </button>
        )}
        <button
          type="submit"
          className="rounded bg-[#201e2d] px-4 py-2 text-sm text-white"
        >
          {normalizedQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {normalizedQuery && (
        <>
          <div className="mt-6 flex items-center justify-between border-b border-[#e7e7e7] pb-4">
            <h2 className="m-0 text-base font-semibold">'{query}' 검색 결과</h2>

            {!isLoading && !errorMessage && (
              <p className="m-0 text-sm text-[#8a8a8a]">{movies.length}편</p>
            )}
          </div>

          {isLoading ? (
            <p>검색 결과를 불러오는 중이에요.</p>
          ) : errorMessage ? (
            <p role="alert">{errorMessage}</p>
          ) : movies.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul className="mt-6 grid list-none grid-cols-2 gap-x-8 p-0">
              {movies.map((movie) => {
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li
                    key={movie.id}
                    className="flex min-w-0 gap-4 border-b border-[#e7e7e7] py-5"
                  >
                    {posterUrl ? (
                      <img
                        className="aspect-2/3 w-28 shrink-0 rounded object-cover"
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                      />
                    ) : (
                      <div className="grid aspect-2/3 w-28 shrink-0 place-items-center rounded bg-gray-300 text-xs text-gray-500">
                        이미지 없음
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="m-0 text-base font-bold">{movie.title}</h3>

                      <p className="mt-1 text-xs text-[#8a8a8a]">
                        {movie.original_title} · {movie.release_date}
                      </p>

                      <p className="mt-3 text-sm text-[#6d6d6d]">
                        {movie.overview}
                      </p>

                      <Link
                        className="mt-4 inline-block text-sm font-semibold text-blue-600"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
