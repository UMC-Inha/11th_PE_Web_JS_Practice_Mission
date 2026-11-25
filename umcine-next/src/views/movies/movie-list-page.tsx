"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams?.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 1 ? pageParam : 1;

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 1, 500);

  function handlePageChange(nextPage: number) {
    router.push(nextPage > 1 ? `/?page=${nextPage}` : "/");
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] pt-6 pb-[60px]">
      <h2 className="mb-4 text-center text-[30px] font-extrabold">영화 목록</h2>

      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-sm text-[#888]">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <p className="py-20 text-center text-sm text-[#888]">
          영화 목록을 불러오지 못했어요.
        </p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-sm text-[#888]">
          조건에 맞는 영화가 없어요.
        </p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}