"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { MyRatingPanel } from "../../components/movies/my-rating-panel";
import {
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useFavoriteStatusQuery,
} from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";


function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoriteStatusQuery = useFavoriteStatusQuery(parsedMovieId);
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isBookmarked = favoriteStatusQuery.data ?? false;
  const isBookmarkPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const handleBookmarkClick = () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (isBookmarkPending) return;

    if (isBookmarked) {
      deleteFavoriteMutation.mutate(parsedMovieId);
    } else {
      createFavoriteMutation.mutate(parsedMovieId);
    }
  };

  if (!isValidMovieId) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex flex-1 items-center justify-center py-24 text-sm text-gray-500">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex-1">
      <section className="relative h-90 overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-360 flex-col justify-between px-20 py-8 text-white">
          <Link href="/" className="flex items-center gap-1 self-start text-xs font-semibold">
            <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 brightness-0 invert" />
            영화 목록
          </Link>

          <div>
            <h1 className="text-[44px] font-bold">{movie.title}</h1>
            <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
              <span>{movie.release_date}</span>
              {genreNames && <span>{genreNames}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-360 gap-10 px-20 py-10">
        <div className="flex flex-1 gap-8">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-2/3 w-50 shrink-0 rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="flex aspect-2/3 w-50 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
          <div>
            {movie.tagline && <h2 className="text-lg font-bold">{movie.tagline}</h2>}
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={isBookmarkPending}
              className="mt-5 flex items-center gap-2 rounded-lg bg-[#4f5de8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              <img
                src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
              {isBookmarked ? "북마크 해제" : "북마크"}
            </button>
          </div>
        </div>

        <MyRatingPanel key={movie.id} movieId={movie.id} />
      </section>
    </main>
  );
}