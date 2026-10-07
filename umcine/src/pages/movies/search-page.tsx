import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

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

  return (
    <main className="mx-auto max-w-[1440px]">
      {normalizedQuery ? (
        <section className="flex flex-col gap-4 px-20 pt-6 pb-6">
          <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
            영화 검색
          </h1>
          <form
            id="movie-search-form"
            onSubmit={handleSubmit}
            className="flex h-[52px] w-full items-center gap-3 rounded-[10px] border border-[#E3E6EB] bg-white pr-[10px] pl-4 shadow-[0_4px_12px_rgba(17,19,24,0.04)]"
          >
            <SearchIcon />
            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="min-w-0 flex-1 text-sm leading-[17px] font-bold text-[#17191E] outline-none placeholder:font-normal placeholder:text-[#969DA8]"
            />
            {searchText && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setSearchText("")}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#606774]"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#17191E] px-4 text-[13px] leading-4 font-extrabold text-white"
            >
              다시 검색
            </button>
          </form>
        </section>
      ) : (
        <section className="flex flex-col items-center px-[72px] pt-[209px] pb-[210px]">
          <div className="flex w-full max-w-[790px] flex-col items-center gap-9">
            <h1 className="text-[46px] leading-[52px] font-bold tracking-[-2.3px] text-[#17191E]">
              어떤 영화를 찾고 있나요?
            </h1>
            <form
              id="movie-search-form"
              onSubmit={handleSubmit}
              className="flex h-[74px] w-full items-center gap-[14px] rounded-[12px] border-2 border-[#17191E] bg-white pr-[17px] pl-[21px] shadow-[0_12px_34px_rgba(17,19,24,0.08)]"
            >
              <SearchIcon />
              <input
                aria-label="검색어"
                placeholder="예: 스파이더맨"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="min-w-0 flex-1 px-0.5 py-px text-[17px] leading-5 text-[#17191E] outline-none placeholder:text-[#969DA8]"
              />
              <button
                type="submit"
                className="flex h-[42px] shrink-0 items-center justify-center rounded-lg border border-[#17191E] bg-[#17191E] px-4 text-sm leading-[17px] font-extrabold text-white"
              >
                검색
              </button>
            </form>
          </div>
        </section>
      )}

      {normalizedQuery && (
        <section className="flex flex-col gap-5 px-20 pb-20">
          <div className="flex items-end justify-between border-b border-[#E3E6EB] pb-4">
            <h2 className="text-[17px] leading-5 font-bold text-[#17191E]">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-[11px] leading-[13px] text-[#969DA8]">
              영화 {searchResults.length}편
            </p>
          </div>
          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-sm text-[#606774]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-x-[34px]">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="border-b border-[#E3E6EB] last:border-b-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0"
                >
                  <article className="flex items-start gap-[18px] py-5">
                    <div className="relative h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px] bg-[#F6F7F9]">
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                        className="size-full object-cover"
                      />
                      <BookmarkButton
                        movieId={movie.id}
                        className="absolute top-2 right-2"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pt-1">
                      <h3 className="text-lg leading-6 font-bold text-[#17191E]">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs leading-[14px] text-[#969DA8]">
                        <span>{movie.originalTitle}</span>
                        <span>{movie.releaseDate}</span>
                      </div>
                      <p className="line-clamp-3 text-[12.5px] leading-5 text-[#606774]">
                        {movie.overview}
                      </p>
                      <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="flex items-center gap-1 text-xs leading-[14px] font-extrabold text-[#2563EB]"
                        >
                          상세 보기
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="size-4 fill-current"
                          >
                            <path d="M13.3 17.275a.95.95 0 0 1-.288-.725c.009-.283.113-.525.313-.725L16.15 13H5a.97.97 0 0 1-.713-.288A.97.97 0 0 1 4 12c0-.283.096-.521.287-.713A.97.97 0 0 1 5 11h11.15L13.3 8.15a.95.95 0 0 1-.3-.713c0-.275.1-.512.3-.712.2-.2.438-.3.713-.3.275 0 .512.1.712.3L19.3 11.3c.1.1.171.208.213.325.041.117.062.242.062.375s-.021.258-.062.375a.88.88 0 0 1-.213.325l-4.6 4.6a.97.97 0 0 1-.687.275.97.97 0 0 1-.713-.3Z" />
                          </svg>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-6 shrink-0 fill-[#606774]"
    >
      <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
    </svg>
  );
}
