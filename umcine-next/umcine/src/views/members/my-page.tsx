"use client";

import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useMyFavoritesQuery } from "../../hooks/use-my-favorites-query";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings-query";
import { FavoriteRating } from "../../components/ratings/favorite-rating";
import type { Movie } from "../../types/movie";
import { getTmdbImageUrl } from "../../utils/movies/tmdb-images";
import { getMyInfo, MY_INFO_QUERY_KEY } from "../../api/members/get-my-info";

const MOVIES_PER_PAGE = 10;

export function MyPage() {
  const [page, setPage] = useState(1);
  const myInfoQuery = useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: getMyInfo,
  });
  // 불러오는 중이거나 실패하면 빈 칸 대신 표시할 글자
  const myInfoFallback = myInfoQuery.isError ? "불러오지 못했어요" : "…";
  // 즐겨찾기 목록은 서버 응답을 기준으로 한다.
  const myFavoritesQuery = useMyFavoritesQuery();
  const bookmarkedMovieIds =
    myFavoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  // 즐겨찾기 영화마다 내 평점을 붙여 보여주려고 movieId로 찾기 쉽게 만듦
  const { memberId, ratingsQuery } = useMyRatingsQuery();
  const ratingByMovieId = new Map(
    (ratingsQuery.data ?? []).map((rating) => [rating.movieId, rating]),
  );

  const renderMyRating = (movie: Movie) => {
    const ratingMessageClass = "pt-2 text-xs leading-[14px] text-[#969DA8]";
    if (memberId === null || ratingsQuery.isError) {
      return <p className={ratingMessageClass}>평점을 불러오지 못했어요.</p>;
    }
    if (ratingsQuery.isPending) {
      return <p className={ratingMessageClass}>평점을 불러오는 중이에요.</p>;
    }
    return (
      <FavoriteRating
        movieId={movie.id}
        memberId={memberId}
        rating={ratingByMovieId.get(movie.id)}
      />
    );
  };

  const totalPages = Math.max(
    1,
    Math.ceil(bookmarkedMovieIds.length / MOVIES_PER_PAGE),
  );
  // 즐겨찾기를 해제해 페이지가 줄어들면 마지막 페이지로 맞춤
  const currentPage = Math.min(page, totalPages);
  const pagedMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE,
  );

  const movieQueries = useQueries({
    queries: pagedMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  const isPending = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);
  const movies: Movie[] = movieQueries.flatMap((query) =>
    query.data
      ? [
          {
            id: query.data.id,
            title: query.data.title,
            originalTitle: query.data.original_title,
            overview: query.data.overview,
            tagline: query.data.tagline,
            posterPath: getTmdbImageUrl(query.data.poster_path),
            backdropPath: getTmdbImageUrl(query.data.backdrop_path),
            releaseDate: query.data.release_date,
            genres: query.data.genres.map((genre) => genre.name),
            runtime: query.data.runtime ? `${query.data.runtime}분` : "",
          },
        ]
      : [],
  );

  const messageClass = "self-stretch py-20 text-center text-sm text-[#606774]";

  return (
    <main className="mx-auto flex min-h-[933px] max-w-[1440px] flex-col items-start gap-7 px-20 py-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191E]">
          내 정보
        </h1>
        <Link
          href="/me/edit"
          className="flex h-[42px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-sm leading-[17px] font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      {/* 기본 정보 */}
      <section className="flex w-full flex-col gap-4 border-t border-[#E3E6EB] pt-5">
        <h2 className="text-lg leading-[22px] font-extrabold text-[#17191E]">
          기본 정보
        </h2>
        <div className="flex items-center gap-10 border-b border-[#E3E6EB] pb-5">
          <div className="flex size-[84px] shrink-0 items-center justify-center rounded-full bg-[#E3E6EB]">
            <img src="/icons/person.svg" alt="" className="size-10" />
          </div>
          <dl className="grid flex-1 grid-cols-[400px_1fr] gap-x-10">
            <div className="flex flex-col gap-1.5">
              <dt className="text-[11px] leading-[13px] text-[#969DA8]">
                닉네임
              </dt>
              <dd className="text-[15px] leading-[18px] font-extrabold text-[#17191E]">
                {myInfoQuery.data?.nickname ?? myInfoFallback}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="text-[11px] leading-[13px] text-[#969DA8]">
                이메일
              </dt>
              <dd className="text-[15px] leading-[18px] font-extrabold text-[#17191E]">
                {myInfoQuery.data?.email ?? myInfoFallback}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 내 즐겨찾기 */}
      <section className="flex w-full flex-col gap-4">
        <h2 className="text-lg leading-[22px] font-extrabold text-[#17191E]">
          내 즐겨찾기
        </h2>
        {myFavoritesQuery.isPending ? (
          <p className={messageClass}>즐겨찾기 목록을 불러오는 중이에요.</p>
        ) : myFavoritesQuery.isError ? (
          <p className={messageClass}>즐겨찾기 목록을 불러오지 못했어요.</p>
        ) : bookmarkedMovieIds.length === 0 ? (
          <p className={messageClass}>즐겨찾기한 영화가 없어요.</p>
        ) : isPending ? (
          <p className={messageClass}>즐겨찾기 목록을 불러오는 중이에요.</p>
        ) : isError ? (
          <p className={messageClass}>즐겨찾기 목록을 불러오지 못했어요.</p>
        ) : (
          <div className="flex w-full flex-col gap-7">
            <MovieGrid movies={movies} renderExtra={renderMyRating} />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </main>
  );
}
