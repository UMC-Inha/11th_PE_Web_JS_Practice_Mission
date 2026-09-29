import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
  }

  return (
    <main>
        {!normalizedQuery ? (
        <section className="flex min-h-[430px] items-center justify-center px-5">
          <div className="w-full max-w-[790px]">
            <h1 className="mb-6 text-center text-[46px] font-bold leading-[44px] tracking-[-2.3px]">
              어떤 영화를 찾고 있나요?
            </h1>

            <form
              onSubmit={handleSubmit}
              className="flex h-[74px] w-full items-center rounded-[10px] border-2 border-[#17191E] bg-white px-[17px]"
            >
              <img
                src="/icons/search.svg"
                alt=""
                className="h-[18px] w-[18px]"
              />

              <input
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="ml-[14px] min-w-0 flex-1 border-none bg-transparent text-[14px] outline-none placeholder:text-[#969DA8]"
              />

              <button
                type="submit"
                className="flex h-[42px] w-[59px] items-center justify-center rounded-[8px] bg-[#17191E] text-[14px] font-bold text-white"
              >
                검색
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-[1360px] px-6 py-8 lg:px-10">
          <h1 className="mb-5 text-[38px] font-bold leading-[44px] tracking-[-1.7px]">
            영화 검색
          </h1>
          {}
          <form
            onSubmit={handleSubmit}
            className="flex h-[56px] w-full items-center rounded-[10px] border border-[#DCE0E6] bg-white px-4"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-5 w-5"
            />

            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="ml-4 min-w-0 flex-1 border-none bg-transparent text-[14px] font-semibold outline-none"
            />

            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="mr-4 flex h-8 w-8 items-center justify-center text-[28px] font-light text-[#697281]"
            >
              ×
            </button>

            <button
              type="submit"
              className="flex h-[42px] items-center justify-center rounded-[8px] bg-[#17191E] px-4 text-[14px] font-bold text-white"
            >
              다시 검색
            </button>
          </form>

          {/* 검색 결과 제목 */}
          <div className="flex items-center justify-between border-b border-[#DCE0E6] py-5">
            <h2 className="text-[18px] font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-[12px] text-[#969DA8]">
              영화 {searchResults.length}편 · 1페이지
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-20 text-center text-[#969DA8]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-[#DCE0E6] py-5"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-[194px] w-[130px] rounded-[8px] object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 py-1">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <h3 className="mb-2 text-[18px] font-bold">
                        {movie.title}
                      </h3>
                    </Link>

                    <div className="mb-3 flex flex-wrap gap-x-3 text-[13px] text-[#969DA8]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
                    </div>

                    <p className="mb-5 line-clamp-2 text-[14px] leading-[22px] text-[#697281]">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-[14px] font-bold text-blue-600"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}