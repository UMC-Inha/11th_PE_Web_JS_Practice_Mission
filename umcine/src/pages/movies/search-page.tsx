import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
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

  return (
    <main
      className={cn(
        "mx-auto pb-[60px]",
        hasQuery
          ? "w-[min(1080px,100%_-_48px)] pt-6"
          : "w-[min(600px,100%_-_48px)] pt-40",
      )}
    >
      <h1
        className={cn(
          "font-bold",
          hasQuery ? "mb-4 text-[30px]" : "mb-8 text-center text-3xl",
        )}
      >
        {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-3 bg-white pr-2 pl-4",
          hasQuery
            ? "h-[46px] rounded-lg border border-[#e5e7eb]"
            : "h-14 rounded-xl border-[1.5px] border-[#111] pr-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        )}
      >
        <img
          src="/icons/search.svg"
          alt=""
          className="size-5 shrink-0 opacity-70"
        />
        <input
          aria-label="검색어"
          placeholder="예: 스파이더맨"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className={cn(
            "min-w-0 flex-1 outline-none placeholder:font-normal placeholder:text-[#9ca3af]",
            hasQuery ? "text-[13px] font-bold" : "text-sm",
          )}
        />
        {hasQuery && searchText && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
            className="grid size-7 shrink-0 cursor-pointer place-items-center"
          >
            <img src="/icons/close.svg" alt="" className="size-4 opacity-70" />
          </button>
        )}
        <button
          type="submit"
          className={cn(
            "shrink-0 cursor-pointer rounded-md bg-[#111] px-3.5 text-xs font-bold text-white",
            hasQuery ? "h-8" : "h-9",
          )}
        >
          {hasQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {hasQuery && (
        <section className="mt-5">
          <div className="flex items-end justify-between border-b border-[#e5e7eb] pb-3">
            <h2 className="text-[15px] font-bold">'{query}' 검색 결과</h2>
            <p className="text-[11px] text-[#9ca3af]">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-sm text-[#888]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 border-b border-[#e5e7eb] py-4"
                >
                  {/* 포스터 위에 북마크 버튼을 올리기 위한 relative 래퍼 */}
                  <div className="relative aspect-[2/3] w-24 shrink-0">
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="size-full rounded-md object-cover"
                    />
                    <BookmarkButton movieId={movie.id} />
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <h3 className="text-[15px] font-bold">{movie.title}</h3>
                    <p className="mt-1.5 flex flex-wrap gap-x-2 text-[11px] text-[#9ca3af]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
                    </p>
                    <p className="mt-2 line-clamp-3 text-xs leading-[1.7] text-[#555]">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto pt-3 text-[11px] font-bold text-[#2563EB]"
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