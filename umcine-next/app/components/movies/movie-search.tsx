"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { searchMovies } from "@/api/movies/search-movies";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

export function MovieSearch() {
  // TanStack의 validateSearch 대체: URL의 ?query= 값을 useSearchParams로 읽는다. 없으면 undefined.
  const query = useSearchParams().get("query") ?? undefined;
  const router = useRouter(); //검색어를 URL의 search param에 반영한다.
  const [searchText, setSearchText] = useState(query ?? "");

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 맞춘다. effect 대신 렌더 중 상태 보정 패턴을 사용한다.
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim() ?? ""; //빈 검색어 안내 화면 분기에 사용

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) { //폼제출 이벤트의 타입을 적는다.
    event.preventDefault(); //브라우저의 기본 새로고침을 막고 (->router.push)
    const nextQuery = searchText.trim();
    router.push(
      nextQuery ? `/search?query=${encodeURIComponent(nextQuery)}` : "/search",
    );
  }

  function handleClear() {
    setSearchText("");
    router.push("/search");
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
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 sm:px-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            어떤 영화를 찾고 있나요?
          </h2>
          <form
            className="flex w-full max-w-[560px] items-center gap-2 sm:gap-3"
            onSubmit={handleSubmit}
          >
            {searchBar}
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-full bg-gray-900 px-4 py-[11px] text-[15px] font-semibold whitespace-nowrap text-white sm:px-6"
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
      <div className="p-4 text-left sm:p-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900 sm:text-2xl">
          영화 검색
        </h2>

        <form className="flex items-center gap-2 sm:gap-3" onSubmit={handleSubmit}>
          {searchBar}
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full bg-gray-900 px-4 py-[11px] text-[15px] font-semibold whitespace-nowrap text-white sm:px-6"
          >
            다시 검색
          </button>
        </form>

        <div className="mt-7 mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            &apos;{query}&apos; 검색 결과
          </h3>
          <p className="text-sm text-gray-500">
            영화 {searchResults.length}편 · 1페이지
          </p>
        </div>

        {searchQuery.isLoading ? (
          <p className="py-10 text-center text-gray-500">
            검색 결과를 불러오는 중이에요.
          </p>
        ) : searchQuery.isError ? (
          <p className="py-10 text-center text-red-500">
            검색 결과를 불러오지 못했어요.
          </p>
        ) : searchQuery.isSuccess && searchResults.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            검색 결과가 없어요.
          </p>
        ) : (
          <ul className="m-0 grid grid-cols-2 list-none gap-x-4 p-0 sm:gap-x-8">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-3 border-b border-gray-200 py-5 sm:gap-5"
              >
                {getTmdbPosterUrl(movie.poster_path) ? (
                  <img
                    src={getTmdbPosterUrl(movie.poster_path)!}
                    alt={`${movie.title} 포스터`}
                    className="aspect-[2/3] w-16 shrink-0 rounded-lg object-cover sm:w-24"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-16 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500 sm:w-24">
                    이미지 없음
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h4 className="text-base font-bold text-gray-900">
                    {movie.title}
                  </h4>
                  <p className="text-[13px] text-gray-500">
                    {movie.original_title}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {movie.release_date}
                  </p>
                  <p className="mt-1.5 mb-2 line-clamp-2 text-sm text-gray-500">
                    {movie.overview}
                  </p>
                  <Link
                    href={`/movies/${movie.id}`}
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
