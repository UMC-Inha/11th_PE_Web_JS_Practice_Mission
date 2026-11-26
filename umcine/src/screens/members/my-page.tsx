"use client";

import { useState } from "react";
import { Pagination } from "../../components/movies/pagination";
import Link from "next/link";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetailOptions } from "../../queries/movie-query-options";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });

  const favorites = favoritesQuery.data ?? [];

  // 한 페이지에 영화 5편 표시
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(favorites.length / pageSize));
  const selectedPage = Math.min(currentPage, totalPages);

  const startIndex = (selectedPage - 1) * pageSize;
  const visibleFavorites = favorites.slice(startIndex, startIndex + pageSize);

  // 즐겨찾기에 담긴 영화들의 상세 정보를 각각 조회
  const movieQueries = useQueries({
    queries: visibleFavorites.map((favorite) =>
      getMovieDetailOptions(favorite.movieId),
    ),
  });

  const isMoviesLoading = movieQueries.some((query) => query.isPending);
  const isMoviesError = movieQueries.some((query) => query.isError);

  const favoriteMovies = movieQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );

  if (!accessToken) {
    return <main className="flex-1 px-5 py-6">로그인이 필요해요.</main>;
  }

  if (meQuery.isLoading) {
    return (
      <main className="flex-1 px-5 py-6">내 정보를 불러오는 중이에요.</main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <main className="flex-1 px-5 py-6">내 정보를 불러오지 못했어요.</main>
    );
  }

  const member = meQuery.data;

  return (
    <main className="flex-1 bg-[#f6f7f9] px-5 py-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between border-b border-[#dfe3ea] pb-6">
          <h1 className="text-[32px] font-bold">내 정보</h1>

          <Link
            href="/my-edit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section
          className="border-b border-[#dfe3ea] py-5"
          aria-labelledby="basic-info-heading"
        >
          <h2 id="basic-info-heading" className="mb-4 text-base font-bold">
            기본 정보
          </h2>

          <div className="flex items-center gap-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#e5e7eb]">
              <img
                src="/icons/person.svg"
                alt="기본 프로필"
                className="scale-200"
              />
            </div>

            <dl className="grid flex-1 grid-cols-2 gap-6">
              <div>
                <dt className="mb-1 text-xs text-[#98a2b3]">닉네임</dt>
                <dd className="text-sm font-semibold">{member.nickname}</dd>
              </div>

              <div>
                <dt className="mb-1 text-xs text-[#98a2b3]">이메일</dt>
                <dd className="text-sm font-semibold">{member.email}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="pt-6" aria-labelledby="favorite-movies-heading">
          <h2 id="favorite-movies-heading" className="mb-4 text-base font-bold">
            내 즐겨찾기
          </h2>

          {favoritesQuery.isPending ? (
            <p>즐겨찾기를 불러오는 중이에요.</p>
          ) : favoritesQuery.isError ? (
            <p>즐겨찾기를 불러오지 못했어요.</p>
          ) : favorites.length === 0 ? (
            <p>즐겨찾기한 영화가 없어요.</p>
          ) : isMoviesLoading ? (
            <p>영화 정보를 불러오는 중이에요.</p>
          ) : isMoviesError ? (
            <p>영화 정보를 불러오지 못했어요.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {favoriteMovies.map((movie) => {
                  const posterUrl = getTmdbPosterUrl(movie.poster_path);

                  return (
                    <article key={movie.id} className="min-w-0">
                      <Link href={`/movies/${movie.id}`} className="block">
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="h-68 w-full rounded-lg object-cover"
                          />
                        ) : (
                          <div className="grid h-68 place-items-center rounded-lg bg-gray-200">
                            포스터 없음
                          </div>
                        )}

                        <h3 className="mt-2 truncate text-sm font-bold">
                          {movie.title}
                        </h3>

                        <p className="mt-1 text-xs text-[#98a2b3]">
                          {movie.release_date}
                        </p>
                      </Link>
                    </article>
                  );
                })}
              </div>

              <Pagination
                currentPage={selectedPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
