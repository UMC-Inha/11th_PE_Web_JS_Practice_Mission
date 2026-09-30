import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchPageContent key={query ?? ""} query={query} />;
}

function SearchPageContent({ query }: { query: string | undefined }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const results = normalizedQuery
    ? movies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery) || movie.originalTitle.toLowerCase().includes(normalizedQuery))
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  const form = (
    <form onSubmit={handleSubmit} role="search" className={cn("flex w-full items-center gap-3 rounded-[10px] border bg-white px-4", normalizedQuery ? "h-[54px] border-[#dce1e8]" : "h-[74px] border-[#181a20] shadow-lg")}>
      <img src="/movie-icons/search.svg" alt="" className="h-5 w-5 shrink-0" />
      <input aria-label="영화 검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#939baa]" />
      {searchText && <button type="button" aria-label="검색어 지우기" onClick={() => setSearchText("")} className="p-2"><img src="/movie-icons/close.svg" alt="" className="h-5 w-5" /></button>}
      <button type="submit" className="h-10 shrink-0 rounded-md bg-[#181a20] px-4 text-sm font-bold text-white">{normalizedQuery ? "다시 검색" : "검색"}</button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[582px] flex-1 flex-col items-center px-5 pt-[120px] sm:pt-[200px]">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-[40px]">어떤 영화를 찾고 있나요?</h1>
        <div className="w-full max-w-[790px]">{form}</div>
        <p className="mt-5 text-sm text-[#788191]">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[calc(100%-40px)] max-w-[1280px] flex-1 py-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
      <h1 className="mb-4 text-[32px] font-bold tracking-tight">영화 검색</h1>
      {form}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e5eb] pb-4">
        <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
        <p aria-live="polite" className="text-xs text-[#788191]">영화 {results.length}편</p>
      </div>
      {results.length === 0 ? <p className="py-20 text-center text-[#677080]">검색 결과가 없어요.</p> : (
        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {results.map((movie) => (
            <li key={movie.id} className="flex min-w-0 gap-5 border-b border-[#e2e5eb] py-5 md:min-h-[230px]">
              <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="shrink-0">
                <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[190px] w-[126px] rounded-lg object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <h3 className="text-base font-bold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3>
                <p className="mt-2 text-xs leading-5 text-[#939baa]">{movie.originalTitle} <span className="inline-block">{movie.releaseDate}</span></p>
                <p className="mt-2 text-xs leading-5 text-[#677080]">{movie.overview}</p>
                <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto pt-4 text-xs font-bold text-[#2864fa]">상세 보기 →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

