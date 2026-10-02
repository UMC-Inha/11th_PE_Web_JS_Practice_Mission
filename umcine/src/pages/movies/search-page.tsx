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

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 lg:px-20">
      <section className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold sm:text-[40px]">
          어떤 영화를 찾고 있나요?
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 rounded-xl border-2 border-gray-300 bg-white p-4"
        >
          <img
            className="h-6 w-6 opacity-60"
            src="/icons/search.svg"
            alt=""
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
            className="min-w-0 flex-1 outline-none"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#191b20] px-5 py-3 text-sm font-bold text-white"
          >
            검색
          </button>
        </form>
      </section>

      {!normalizedQuery ? (
        <p className="mt-10 text-center text-gray-500">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            ‘{query}’ 검색 결과
          </h2>

          <p className="mt-2 text-gray-500">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="mt-8">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="mt-6 space-y-5">
              {searchResults.map(
                (movie) => (
                  <li
                    key={movie.id}
                    className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row"
                  >
                    <Link
                      to="/movies/$movieId"
                      params={{
                        movieId:
                          String(movie.id),
                      }}
                      className="shrink-0"
                    >
                      <img
                        className="h-[180px] w-[125px] rounded-lg object-cover"
                        src={
                          movie.posterPath
                        }
                        alt={`${movie.title} 포스터`}
                      />
                    </Link>

                    <div>
                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId:
                            String(
                              movie.id,
                            ),
                        }}
                      >
                        <h3 className="text-xl font-bold">
                          {movie.title}
                        </h3>
                      </Link>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          movie.originalTitle
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {movie.releaseDate}
                      </p>

                      <p className="mt-4 leading-7">
                        {movie.overview}
                      </p>
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