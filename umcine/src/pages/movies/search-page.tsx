import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

// CSS Module(search-page.module.css)에서 Tailwind 유틸리티 클래스로 전환
export function SearchPage() {
  const { query } = useSearch({ from: "/search" }); //useSearch로 검증된 query값을 가져온다.
  const navigate = useNavigate({ from: "/search" }); //검색어를 URL의 search param에 반영한다.
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? ""; //양끝 공백 제거후 소문자로 바꾼다 -> 제목이나 원제에 있는지 확인하기 위한 정규화
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) { //폼제출 이벤트의 타입을 적는다.
    event.preventDefault(); //브라우저의 기본 새로고침을 막고 (->useNavigate)
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  const searchBar = (
    <div className="flex max-w-[480px] flex-1 items-center gap-2 rounded-full border-[1.5px] border-gray-900 bg-white px-4 py-2.5">
      <img src="/icons/search.svg" alt="" className="size-[18px] shrink-0" />
      <input
        aria-label="검색어"
        className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-gray-900 outline-none"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      {searchText && (
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          onClick={handleClear}
        >
          <img src="/icons/close.svg" alt="검색어 지우기" className="size-4" />
        </button>
      )}
    </div>
  );

  if (!normalizedQuery) {
    return (
      <div className="flex flex-1 flex-col bg-gray-100">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-900">
            어떤 영화를 찾고 있나요?
          </h2>
          <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            {searchBar}
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-full bg-gray-900 px-6 py-[11px] text-[15px] font-semibold whitespace-nowrap text-white"
            >
              검색
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-100">
      <div className="p-8 text-left">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">영화 검색</h2>

        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
          {searchBar}
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full bg-gray-900 px-6 py-[11px] text-[15px] font-semibold whitespace-nowrap text-white"
          >
            다시 검색
          </button>
        </form>

        <div className="mt-7 mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            '{query}' 검색 결과
          </h3>
          <p className="text-sm text-gray-500">
            영화 {searchResults.length}편 · 1페이지
          </p>
        </div>

        {searchResults.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            검색 결과가 없어요.
          </p>
        ) : (
          <ul className="m-0 grid grid-cols-2 list-none gap-x-8 p-0">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-5 border-b border-gray-200 py-5"
              >
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="aspect-[2/3] w-24 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h4 className="text-base font-bold text-gray-900">
                    {movie.title}
                  </h4>
                  <p className="text-[13px] text-gray-500">
                    {movie.originalTitle}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {movie.releaseDate}
                  </p>
                  <p className="mt-1.5 mb-2 line-clamp-2 text-sm text-gray-500">
                    {movie.overview}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="self-start text-sm font-semibold text-blue-600 no-underline"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
