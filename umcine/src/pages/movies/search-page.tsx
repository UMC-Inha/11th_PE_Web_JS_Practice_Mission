import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieSearchForm } from "../../components/movies/movie-search-form";
import { MovieSearchCard } from "../../components/movies/movie-search-card";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL 검색어를 입력창에 동기화해요.
    setSearchText(query);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- 요청한 예제처럼 새 검색 전에 이전 결과를 초기화해요.
    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

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

  const normalizedQuery = query.trim();

  return (
    <main>
      {!normalizedQuery ? (
        <section className="flex min-h-[430px] items-center justify-center px-5">
          <div className="w-full max-w-[790px]">
            <h1 className="mb-6 text-center text-[46px] font-bold leading-[44px] tracking-[-2.3px]">
              어떤 영화를 찾고 있나요?
            </h1>

            <MovieSearchForm
              variant="initial"
              searchText={searchText}
              onSearchTextChange={setSearchText}
              onSubmit={handleSubmit}
              onClear={handleClear}
            />
          </div>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-[1360px] px-6 py-8 lg:px-10">
          <h1 className="mb-5 text-[38px] font-bold leading-[44px] tracking-[-1.7px]">
            영화 검색
          </h1>
          <MovieSearchForm
            variant="results"
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />

          {/* 검색 결과 제목 */}
          <div className="flex items-center justify-between border-b border-[#DCE0E6] py-5">
            <h2 className="text-[18px] font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-[12px] text-[#969DA8]">
              {!isLoading && !errorMessage && (
                <>영화 {movies.length}편 · 1페이지</>
              )}
            </p>
          </div>

          {isLoading ? (
            <div role="status" className="py-20 text-center text-[#969DA8]">
              검색 결과를 불러오는 중이에요.
            </div>
          ) : errorMessage ? (
            <div role="alert" className="py-20 text-center text-red-500">
              {errorMessage}
            </div>
          ) : movies.length === 0 ? (
            <div className="py-20 text-center text-[#969DA8]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
              {movies.map((movie) => (
                <MovieSearchCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
