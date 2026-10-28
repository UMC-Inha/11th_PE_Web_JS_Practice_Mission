import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    let ignore = false;

    async function loadSearchResults() {
      const nextQuery = query.trim();
      setSearchText(query);
      setMovies([]);
      setTotalResults(0);
      setErrorMessage(null);

      if (!nextQuery) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await searchMovies({ query: nextQuery });
        if (!ignore) {
          setMovies(response.results);
          setTotalResults(response.total_results);
        }
      } catch {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadSearchResults();

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  if (!normalizedQuery) {
    return (
      <main className="w-full flex-1 bg-[#F6F7F9] px-5 xl:min-h-[933px] xl:px-20">
        <section className="mx-auto w-full max-w-3xl pt-60">
          <h1 className="text-center text-4xl leading-[44px] font-bold tracking-tight">
            어떤 영화를 찾고 있나요?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex h-16 items-center rounded-xl border-2 border-[#191B20] bg-white px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-5 w-5 shrink-0 opacity-60"
            />
            <input
              type="text"
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              className="h-12 rounded-lg bg-[#191B20] px-6 text-sm font-bold text-white"
            >
              검색
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 px-5 py-6 xl:min-h-[937px] xl:px-20">
      <h1 className="h-11 text-4xl leading-[44px] font-bold tracking-tight">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex h-14 items-center rounded-lg border border-gray-300 bg-white px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
      >
        <img
          src="/icons/search.svg"
          alt=""
          className="h-5 w-5 shrink-0 opacity-60"
        />
        <input
          type="text"
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setSearchText("")}
          aria-label="검색어 지우기"
          className="mr-4 flex h-8 w-8 items-center justify-center text-2xl text-gray-400"
        >
          ×
        </button>
        <button
          type="submit"
          className="h-10 rounded-md bg-[#191B20] px-6 text-sm font-bold text-white"
        >
          다시 검색
        </button>
      </form>

      <section className="mt-5">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-bold">‘{normalizedQuery}’ 검색 결과</h2>
          {!isLoading && !errorMessage && (
            <p className="text-xs text-gray-400">
              영화 {totalResults}편 · 페이지 1
            </p>
          )}
        </div>

        {isLoading ? (
          <p role="status" className="py-12 text-sm text-gray-500">
            검색 결과를 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <p role="alert" className="py-12 text-sm text-red-600">
            {errorMessage}
          </p>
        ) : movies.length === 0 ? (
          <p className="py-12 text-sm text-gray-500">검색 결과가 없어요.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-gray-200 py-5"
                >
                  <div className="relative h-44 w-28 shrink-0">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="h-full w-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-200 text-sm text-gray-500">
                        이미지 없음
                      </div>
                    )}
                    <BookmarkButton
                      movieId={movie.id}
                      movieTitle={movie.title}
                      iconOnly
                    />
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h3 className="truncate text-base font-bold">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {movie.original_title}
                      {" · "}
                      {movie.release_date || "개봉일 정보 없음"}
                    </p>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                      {movie.overview || "줄거리 정보가 없어요."}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-5 inline-block text-sm font-semibold text-blue-600"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}