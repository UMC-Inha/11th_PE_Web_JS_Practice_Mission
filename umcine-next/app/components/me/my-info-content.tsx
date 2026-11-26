"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { ProfileAvatar } from "@/app/components/me/profile-avatar";
import { Pagination } from "@/app/components/movies/pagination";

import { useProfileStore } from "@/stores/profile-store";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";
import { getMe } from "@/api/members/me";
import { useFavoritesQuery } from "@/hooks/use-favorite-query";


const PAGE_SIZE = 10;

export function MyInfoContent() {
  const { data: me } = useQuery({ queryKey: ["members", "me"], queryFn: getMe });
  const profileImage = useProfileStore((state) => state.profileImage);
  const nickname = me?.nickname ?? "";
  const email = me?.email ?? "";

  const favoritesQuery = useFavoritesQuery();
  const favoriteMovieIds = favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(favoriteMovieIds.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = favoriteMovieIds.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  return (
    <>
      <section className="border-b border-gray-200 py-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">기본 정보</h2>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ProfileAvatar imageUrl={profileImage} />
          <div className="w-52">
            <p className="m-0 text-xs text-gray-400">닉네임</p>
            <p className="m-0 mt-1 font-bold text-gray-900">{nickname}</p>
          </div>
          <div>
            <p className="m-0 text-xs text-gray-400">이메일</p>
            <p className="m-0 mt-1 font-bold text-gray-900">{email}</p>
          </div>
        </div>
      </section>

      <section className="py-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">내 즐겨찾기</h2>

        {favoritesQuery.isPending ? (
              <p className="py-10 text-center text-gray-500">불러오는 중이에요.</p>
            ) : favoritesQuery.isError ? (
              <p className="py-10 text-center text-red-500">즐겨찾기를 불러오지 못했어요.</p>
            ) : favoriteMovieIds.length === 0 ? (
              <p className="py-10 text-center text-gray-500">즐겨찾기한 영화가 없어요.</p>
            ) : (

          <>
            <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movieQueries.map((movieQuery, index) => {
                const movieId = pageMovieIds[index];

                if (movieQuery.isPending) {
                  return (
                    <li
                      key={movieId}
                      className="flex aspect-[268/304] items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500"
                    >
                      불러오는 중이에요.
                    </li>
                  );
                }

                if (movieQuery.isError) {
                  return (
                    <li
                      key={movieId}
                      className="flex aspect-[268/304] items-center justify-center rounded-xl bg-gray-200 text-sm text-red-500"
                    >
                      불러오지 못했어요.
                    </li>
                  );
                }

                const movie = movieQuery.data;
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <li key={movieId}>
                    <Link
                      href={`/movies/${movieId}`}
                      className="block no-underline"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="aspect-[268/304] w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[268/304] w-full items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                          이미지 없음
                        </div>
                      )}
                      <h3 className="mt-2 text-[15px] font-bold text-gray-900">
                        {movie.title}
                      </h3>
                      <p className="m-0 text-[13px] text-gray-400">
                        {movie.release_date.replace(/-/g, ".")}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}
