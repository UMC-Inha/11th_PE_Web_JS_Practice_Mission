import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchPageContent key={query ?? ""} query={query} />;
}

function SearchPageContent({ query }: { query: string | undefined }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const normalizedQuery = query?.trim() ?? "";
  const [results, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(normalizedQuery));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  // query가 바뀌면 부모의 key로 새 상태를 만들고 이전 요청은 cleanup으로 무시해요.
  useEffect(() => {
    let ignore = false;
    if (!normalizedQuery) return;
    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
          setTotalResults(response.total_results);
        }
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => { ignore = true; };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  const form = (
    <form onSubmit={handleSubmit} role="search" className={cn("flex w-full items-center gap-3 rounded-[10px] border bg-white px-4", normalizedQuery ? "h-13.5 border-[#dce1e8]" : "h-18.5 border-[#181a20] shadow-lg")}>
      <img src="/movie-icons/search.svg" alt="" className="h-5 w-5 shrink-0" />
      <input aria-label="영화 검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#939baa]" />
      {searchText && <button type="button" aria-label="검색어 지우기" onClick={() => setSearchText("")} className="p-2"><img src="/movie-icons/close.svg" alt="" className="h-5 w-5" /></button>}
      <button type="submit" className="h-10 shrink-0 rounded-md bg-[#181a20] px-4 text-sm font-bold text-white">{normalizedQuery ? "다시 검색" : "검색"}</button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="flex min-h-145.5 flex-1 flex-col items-center px-5 pt-30 sm:pt-50">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-[40px]">어떤 영화를 찾고 있나요?</h1>
        <div className="w-full max-w-197.5">{form}</div>
        <p className="mt-5 text-sm text-[#788191]">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[calc(100%-40px)] max-w-320 flex-1 py-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
      <h1 className="mb-4 text-[32px] font-bold tracking-tight">영화 검색</h1>
      {form}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e5eb] pb-4">
        <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
        <p aria-live="polite" className="text-xs text-[#788191]">{isLoading ? "검색 중" : errorMessage ? "검색 실패" : `영화 ${totalResults}편`}</p>
      </div>
      {isLoading ? <p role="status" className="py-12">검색 결과를 불러오는 중이에요.</p> : errorMessage ? <p role="alert" className="py-12">{errorMessage}</p> : results.length === 0 ? <p className="py-20 text-center text-[#677080]">검색 결과가 없어요.</p> : (
        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {results.map((movie) => (
            <li key={movie.id} className="flex min-w-0 gap-5 border-b border-[#e2e5eb] py-5 md:min-h-57.5">
              <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="shrink-0">
                <MovieImage src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} className="h-47.5 w-31.5 rounded-lg object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col py-1">
                <h3 className="text-base font-bold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3>
                <p className="mt-2 text-xs leading-5 text-[#939baa]">{movie.original_title} <span className="inline-block">{movie.release_date}</span></p>
                <p className="mt-2 text-xs leading-5 text-[#677080]">{movie.overview}</p>
                <BookmarkButton movieId={movie.id} className="mt-3 self-start px-3 py-2 text-xs" />
                <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto pt-4 text-xs font-bold text-[#2864fa]">상세 보기 →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}