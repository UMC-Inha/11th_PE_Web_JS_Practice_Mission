import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
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
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-6 shrink-0 fill-[#606774]"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
            </svg>
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

      {/* 검색 결과 화면 CSS는 아직 없어서 기존 마크업을 그대로 둔다. */}
      {normalizedQuery && (
        <section className="px-20 pb-20">
          <h2>‘{query}’ 검색 결과</h2>
          <p>영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul>
              {searchResults.map((movie) => (
                <li key={movie.id}>
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  <h3>{movie.title}</h3>
                  <p>{movie.originalTitle}</p>
                  <p>{movie.releaseDate}</p>
                  <p>{movie.overview}</p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
