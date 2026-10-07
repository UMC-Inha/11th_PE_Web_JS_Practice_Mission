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

import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({
    from: "/search",
  });

  const navigate = useNavigate({
    from: "/search",
  });


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
              onChange={(event) =>
                setSearchText(
                  event.target.value,
                )
              }
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
    <main className="w-full flex-1 px-5 py-6 xl:h-[937px] xl:flex-none xl:px-20">
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
          onChange={(event) =>
            setSearchText(
              event.target.value,
            )
          }
          className="ml-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />

        <button
          type="button"
          onClick={handleClear}
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
                <div className="mt-5 flex flex-wrap items-center gap-3">
  <Link
    to="/movies/$movieId"
    params={{ movieId: String(movie.id) }}
    className="inline-block text-sm font-semibold text-blue-600"
  >
    상세 보기 →
  </Link>

  <BookmarkButton
    movieId={movie.id}
    movieTitle={movie.title}
  />
</div>
              ),
            )}
          </ul>
        )}
      </section>
    </main>
  );
}