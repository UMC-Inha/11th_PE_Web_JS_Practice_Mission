import {
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
  type SubmitEvent,
} from "react";

import { useMovies } from "../../contexts/movie-context";

export function SearchPage() {
  const { query } = useSearch({
    from: "/search",
  });

  const navigate = useNavigate({
    from: "/search",
  });

  const { movies } = useMovies();

  const [searchText, setSearchText] =
    useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery =
    query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(normalizedQuery) ||
          movie.originalTitle
            .toLowerCase()
            .includes(normalizedQuery),
      )
    : [];

  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextQuery =
      searchText.trim();

    navigate({
      search: nextQuery
        ? { query: nextQuery }
        : {},
    });
  }

  function handleClear() {
    setSearchText("");
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-10 pt-8 pb-12">
      <h1 className="text-4xl font-bold tracking-tight">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex h-14 items-center rounded-lg border border-gray-300 bg-white px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
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
          onChange={(event) =>
            setSearchText(
              event.target.value,
            )
          }
          className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />

        {searchText && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="mr-4 flex h-8 w-8 items-center justify-center text-2xl text-gray-400"
          >
            ×
          </button>
        )}

        <button
          type="submit"
          className="h-10 rounded-md bg-[#191B20] px-6 text-sm font-bold text-white"
        >
          {normalizedQuery
            ? "다시 검색"
            : "검색"}
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-10 text-sm text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <section className="mt-5">
          <div className="flex items-end justify-between border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-xs text-gray-400">
              영화 {searchResults.length}편 · 페이지 1
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-12 text-sm text-gray-500">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-12 lg:grid-cols-2">
              {searchResults.map(
                (movie) => (
                  <li
                    key={movie.id}
                    className="flex gap-5 border-b border-gray-200 py-5"
                  >
                    <img
                      src={
                        movie.posterPath
                      }
                      alt={`${movie.title} 포스터`}
                      className="h-44 w-28 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 pt-1">
                      <h3 className="truncate text-base font-bold">
                        {movie.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {
                          movie.originalTitle
                        }
                        {"  "}
                        {movie.releaseDate}
                      </p>

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {movie.overview}
                      </p>

                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId:
                            String(
                              movie.id,
                            ),
                        }}
                        className="mt-5 inline-block text-sm font-semibold text-blue-600"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </li>
                ),
              )}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}