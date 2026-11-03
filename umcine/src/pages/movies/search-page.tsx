import { BookmarkButton } from "../../components/bookmark-button";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    setSearchText(query ?? "");
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
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
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

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-3 rounded-xl bg-white px-4 py-2",
        normalizedQuery
          ? "mt-5 border border-gray-200"
          : "mx-auto mt-6 max-w-140 border border-[#111111] shadow-md",
      )}
    >
      <img src="/icons/search.svg" alt="" className="h-5 w-5" />
      <input
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      {searchText && (
        <button type="button" onClick={() => setSearchText("")}>
          <img src="/icons/close.svg" alt="검색어 지우기" className="h-4 w-4" />
        </button>
      )}
      <button type="submit" className="rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white">
        {normalizedQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="mx-auto w-full max-w-360 flex-1 px-20 pt-24 pb-12">
        <h1 className="text-center text-[32px] font-bold">어떤 영화를 찾고 있나요?</h1>
        {searchForm}
        <p className="mt-6 text-center text-sm text-gray-500">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-360 flex-1 px-20 py-12">
      <h1 className="text-[28px] font-bold">영화 검색</h1>
      {searchForm}

      <div className="mt-6 flex items-end justify-between border-b border-gray-200 pb-3">
        <h2 className="text-sm font-bold">‘{query}’ 검색 결과</h2>
        {!isLoading && !errorMessage && (
          <p className="text-xs text-gray-400">영화 {movies.length}편</p>
        )}
      </div>

      {isLoading ? (
        <p className="mt-12 text-center text-sm text-gray-500">검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="mt-12 text-center text-sm text-red-500">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">검색 결과가 없어요.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-10">
          {movies.map((movie) => {
            const posterUrl = getTmdbPosterUrl(movie.poster_path);

            return (
              <li key={movie.id} className="flex gap-5 border-b border-gray-200 py-5">
                <div className="relative shrink-0">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={`${movie.title} 포스터`}
                      className="aspect-2/3 w-33 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex aspect-2/3 w-33 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                      이미지 없음
                    </div>
                  )}
                  <BookmarkButton movieId={movie.id} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold">{movie.title}</h3>
                  <p className="mt-1 flex gap-2 text-xs text-gray-400">
                    <span>{movie.original_title}</span>
                    <span>{movie.release_date}</span>
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-4 self-start text-xs font-semibold text-[#4f5de8]"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}