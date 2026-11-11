import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { MovieSearchForm } from "../../components/movies/movie-search-form";
import { MovieSearchCard } from "../../components/movies/movie-search-card";
import Pagination from "../../components/movies/pagination";

export function SearchPage() {
  const { query = "", page: currentPage = 1 } = useSearch({ from: "/search" });
  const normalizedQuery = query.trim();
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery, page: currentPage }],
    queryFn: () => searchMovies({ query: normalizedQuery, page: currentPage }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];
  const totalPages = searchQuery.data?.total_pages ?? 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL 검색어를 입력창에 동기화해요.
    setSearchText(query);
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
              {searchQuery.isSuccess && (
                <>영화 {searchResults.length}편 · {currentPage}페이지</>
              )}
            </p>
          </div>

          {searchQuery.isLoading ? (
            <div role="status" className="py-20 text-center text-[#969DA8]">
              검색 결과를 불러오는 중이에요.
            </div>
          ) : searchQuery.isError ? (
            <div role="alert" className="py-20 text-center text-red-500">
              {searchQuery.error.message}
            </div>
          ) : searchQuery.isSuccess && searchResults.length === 0 ? (
            <div className="py-20 text-center text-[#969DA8]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
              {searchResults.map((movie) => (
                <MovieSearchCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
          {searchQuery.isSuccess && searchResults.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => navigate({ search: { query, page } })}
            />
          )}
        </section>
      )}
    </main>
  );
}
