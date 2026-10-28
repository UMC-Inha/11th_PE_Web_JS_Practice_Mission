import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { Footer } from "../../components/layout/footer";

export function MovieListPage() {
  // TMDB 영화 목록과 요청 상태 관리
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 현재 화면 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);

  // 화면 페이지 2개당 TMDB API 페이지 1개 사용
  const apiPage = Math.ceil(currentPage / 2);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getMovies({ page: apiPage });

        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    // 이전 요청 결과가 반영되지 않도록 방지
    return () => {
      ignore = true;
    };
  }, [apiPage]);

  // 받아온 영화 20개 중 현재 화면에 표시할 10개 선택
  const startIndex = ((currentPage - 1) % 2) * 10;
  const visibleMovies = movies.slice(startIndex, startIndex + 10);

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="flex w-full flex-1 flex-col gap-5 px-20 py-6">
        <h1 className="m-0 text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
          영화 목록
        </h1>

        {/* API 요청 상태에 따라 화면 구분 */}
        {isLoading ? (
          <p>영화 목록을 불러오는 중...</p>
        ) : errorMessage ? (
          <p role="alert">{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={visibleMovies} />
        )}

        {/* 현재 페이지와 페이지 변경 함수 전달 */}
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  );
}