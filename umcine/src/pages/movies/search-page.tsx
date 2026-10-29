import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import BookmarkButton from "../../components/movies/bookmark-button";
import PosterImage from "../../components/movies/poster-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim() ?? "";
  const [searchResults, setSearchResults] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSearchResults() {
      setSearchResults([]);
      setErrorMessage(null);

      if (!normalizedQuery) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await searchMovies({ query: normalizedQuery });
        if (!ignore) setSearchResults(response.results);
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
  }, [normalizedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-[1126px] flex-1 flex-col items-center px-6 pt-24 pb-16">
      <h1 className="text-center text-[32px] font-extrabold text-app-text-h">
        {!normalizedQuery
          ? "어떤 영화를 찾고 있나요?"
          : `'${normalizedQuery}' 검색 결과`}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-10 flex w-full max-w-[774px] items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 pl-5 shadow-sm"
      >
        <img
          className="h-5 w-5 opacity-40"
          src="/icons/search.svg"
          alt=""
          aria-hidden="true"
        />
        <input
          aria-label="검색어"
          className="flex-1 border-none py-2 text-[15px] text-app-text-h outline-none placeholder:text-gray-400"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl border-none bg-gray-900 px-6 py-3 text-sm font-bold text-white"
        >
          검색
        </button>
      </form>

      {normalizedQuery && isLoading && (
        <p role="status" className="mt-10 text-sm text-app-text">
          검색 결과를 불러오는 중이에요.
        </p>
      )}

      {normalizedQuery && !isLoading && errorMessage && (
        <p role="alert" className="mt-10 text-sm text-app-text">
          {errorMessage}
        </p>
      )}

      {normalizedQuery &&
        !isLoading &&
        !errorMessage &&
        searchResults.length === 0 && (
          <p className="mt-10 text-sm text-app-text">
            조건에 맞는 영화가 없어요.
          </p>
        )}

      {normalizedQuery && !isLoading && !errorMessage && searchResults.length > 0 && (
        <div className="mt-10 w-full">
          <p className="text-sm text-app-text">영화 {searchResults.length}편</p>
          <ul className="mt-4 flex flex-col gap-4">
            {searchResults.map((movie) => (
              <li key={movie.id} className="relative">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="flex gap-4 rounded-xl border border-app-border bg-white p-4 no-underline"
                >
                  <PosterImage
                    className="h-36 w-24 flex-shrink-0 rounded-lg object-cover"
                    src={getTmdbPosterUrl(movie.poster_path)}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex min-w-0 flex-col gap-1 py-1">
                    <p className="text-[15px] font-bold text-app-text-h">
                      {movie.title}
                    </p>
                    <p className="text-[13px] text-app-text">
                      {movie.original_title}
                    </p>
                    <p className="text-[13px] text-app-text">
                      {movie.release_date || "개봉일 미정"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-app-text">
                      {movie.overview}
                    </p>
                  </div>
                </Link>
                <BookmarkButton movieId={movie.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
