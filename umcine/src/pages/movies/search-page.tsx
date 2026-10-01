import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const pageX = "px-[max(80px,calc((100%_-_1280px)/2))]";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const hasQuery = normalizedQuery !== "";
  const searchResults = hasQuery
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
    navigate({ search: {} });
  }

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className="flex h-12 w-full items-center gap-3 rounded-lg border border-gray-900 bg-white pr-2 pl-4"
    >
      <img src="/icons/search.svg" alt="" width={16} height={16} />
      <input
        className="min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400"
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      {hasQuery && (
        <button
          type="button"
          className="px-2 text-gray-400"
          aria-label="검색어 지우기"
          onClick={handleClear}
        >
          ✕
        </button>
      )}
      <button
        type="submit"
        className="h-8 shrink-0 rounded-md bg-gray-900 px-4 text-xs font-semibold text-white"
      >
        {hasQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );

  if (!hasQuery) {
  return (
    <main className="min-h-[calc(100vh-148px)] bg-[#f5f6f8]">
      <section className="flex h-145.5 flex-col items-center justify-center gap-10 px-6 py-18">
        <h1 className="text-[40px] font-bold">어떤 영화를 찾고 있나요?</h1>
        <div className="w-full max-w-200 [&>form]:h-16">{searchForm}</div>
        <p className="text-sm text-gray-400">검색어를 입력해 주세요.</p>
      </section>
    </main>
  );
}

  return (
    <main
      className={cn("min-h-[calc(100vh-148px)] bg-[#f5f6f8] py-6", pageX)}
    >
      <h1 className="text-2xl font-bold">영화 검색</h1>
      <div className="mt-4">{searchForm}</div>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-sm font-bold">‘{query}’ 검색 결과</h2>
        <p className="text-xs text-gray-400">영화 {searchResults.length}편</p>
      </div>

      {searchResults.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-400">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex gap-4 border-b border-gray-200 py-5">
              <img
                className="aspect-2/3 w-32 shrink-0 rounded-md object-cover"
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-sm font-bold">{movie.title}</h3>
                <p className="mt-1 flex gap-2 text-xs text-gray-400">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500">
                  {movie.overview}
                </p>
                <Link
                  className="mt-auto pt-2 text-xs font-semibold text-blue-600"
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  상세 보기 →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}