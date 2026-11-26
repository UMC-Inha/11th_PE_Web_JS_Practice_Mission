"use client";

import Link from "next/link";

import { useQueries, useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "../../api/movies/movie-query-options";
import { getMe } from "../../api/members/me";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { useFavoritesQuery } from "../../hooks/use-favorites";

export function MyPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const favoritesQuery = useFavoritesQuery();

  const bookmarkedMovieIds =
    favoritesQuery.data?.result.map((favorite) => favorite.movieId) ?? [];

  const favoriteQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) =>
      movieDetailQueryOptions(movieId, true),
    ),
  });

  const favoriteMovies = favoriteQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-10">
      <div className="flex items-center justify-between border-b border-[#e3e6eb] pb-5">
        <h1 className="text-[28px] font-bold text-[#17191e]">내 정보</h1>

        <Link
          href="/me-edit"
          className="rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-[#e3e6eb] py-7">
        <h2 className="mb-4 text-sm font-bold text-[#17191e]">기본 정보</h2>

        {meQuery.isPending ? (
          <p className="text-sm text-[#606774]">내 정보를 불러오는 중이에요.</p>
        ) : meQuery.isError ? (
          <p className="text-sm text-[#dc2626]">내 정보를 불러오지 못했어요.</p>
        ) : (
          <div className="flex items-center gap-6">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#e3e6eb] text-2xl">
              👤
            </div>

            <div>
              <p className="text-xs text-[#969da8]">닉네임</p>
              <p className="mt-1 text-sm font-semibold text-[#17191e]">
                {meQuery.data.nickname}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#969da8]">이메일</p>
              <p className="mt-1 text-sm font-semibold text-[#17191e]">
                {meQuery.data.email}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="py-7">
        <h2 className="mb-4 text-sm font-bold text-[#17191e]">내 즐겨찾기</h2>

        {favoritesQuery.isPending ? (
          <p className="text-sm text-[#606774]">
            즐겨찾기 목록을 불러오는 중이에요.
          </p>
        ) : favoritesQuery.isError ? (
          <p className="text-sm text-[#dc2626]">
            즐겨찾기 목록을 불러오지 못했어요.
          </p>
        ) : bookmarkedMovieIds.length === 0 ? (
          <p className="text-sm text-[#606774]">즐겨찾기한 영화가 없어요.</p>
        ) : favoriteQueries.some((query) => query.isPending) ? (
          <p className="text-sm text-[#606774]">
            즐겨찾기 영화를 불러오는 중이에요.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {favoriteMovies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <article key={movie.id}>
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="aspect-[2/3] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-[#e3e6eb] text-xs text-[#606774]">
                      이미지 없음
                    </div>
                  )}

                  <h3 className="mt-2 text-sm font-semibold text-[#17191e]">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#969da8]">
                    {movie.release_date}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
