"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { MovieRatingSection } from "@/app/components/movies/movie-rating-section";
import { useFavoriteMutations } from "@/hooks/use-favorite-mutations";
import { useFavoriteStatusQuery } from "@/hooks/use-favorite-query";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";
import { getMovieDetailErrorMessage } from "@/utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "@/utils/movies/tmdb-image";

// 분 단위 runtime을 "2시간 28분" 형태로 변환. 정보가 없으면(null) 안내 문구
function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

// path param은 서버 컴포넌트(app/movies/[movieId]/page.tsx)가 params에서 꺼내 prop으로 넘겨준다. (문자열)
export function MovieDetail({ movieId }: { movieId: string }) {
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0; //양의 정수일 때만 요청

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const statusQuery = useFavoriteStatusQuery(parsedMovieId);
  const { addMutation, deleteMutation } = useFavoriteMutations(parsedMovieId);
  const isBookmarked = statusQuery.data ?? false;
  const isFavoritePending = addMutation.isPending || deleteMutation.isPending;

  const handleToggleFavorite = () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (isBookmarked) deleteMutation.mutate();
    else addMutation.mutate();
  };

  // 상태 분기: 잘못된 ID → 로딩 → 오류 → 데이터 없음 → 성공
  if (!isValidMovieId) {
    return (
      <main className="px-8 py-16 text-center text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="px-8 py-16 text-center text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="px-8 py-16 text-center text-gray-500">
        {getMovieDetailErrorMessage(movieDetailQuery.error) ?? "영화를 찾을 수 없어요."}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      <div
        className="relative flex min-h-60 flex-col justify-end gap-8 bg-cover bg-center bg-[#111318] px-4 pt-5 pb-6 text-white sm:min-h-80 sm:px-8 before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/15 before:to-black/80 before:content-['']"
        style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}
      >
        {!backdropUrl && (
          <span className="absolute top-3 right-4 z-10 text-xs text-white/60">
            이미지 없음
          </span>
        )}
        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-1.5 text-sm text-white no-underline"
        >
          <img
            src="/icons/chevron-left.svg"
            alt=""
            className="size-3.5 invert"
          />
          영화 목록
        </Link>

        <div className="relative z-10 mt-auto">
          <h1 className="mb-1 text-2xl font-bold text-white sm:text-[32px]">
            {movie.title}
          </h1>
          <p className="mb-2 text-[15px] text-white/80">
            {movie.original_title}
          </p>
          <p className="m-0 flex gap-3 text-sm text-white/85">
            <span>{movie.release_date}</span>
            <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </p>
        </div>
      </div>

      {/* 반응형: 모바일은 세로로 쌓고(포스터 → 설명 → 평점), lg(1024px~)부터 가로 3단 */}
      <div className="flex flex-col gap-6 p-4 sm:p-8 lg:flex-row lg:items-start lg:gap-8">
        <div className="shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block aspect-[2/3] w-32 rounded-xl object-cover sm:w-40"
            />
          ) : (
            <div className="flex aspect-[2/3] w-32 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500 sm:w-40">
              이미지 없음
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            {movie.tagline}
          </h2>
          <p className="mb-5 text-[15px] leading-[1.6] text-gray-500">
            {movie.overview}
          </p>
          {/* 목록 북마크 배지와 색 통일: 북마크됨 = 파랑, 아님 = 반투명 검정. 글자/아이콘은 항상 흰색 */}
          <button
            type="button"
            aria-pressed={isBookmarked}
            disabled={isFavoritePending}
            onClick={handleToggleFavorite}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-lg px-[18px] py-2.5 text-sm font-semibold text-white transition-colors",
              isBookmarked ? "bg-blue-600" : "bg-black/55",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="size-4 invert"
            />
            즐겨찾기
          </button>
        </div>

        <MovieRatingSection movieId={movie.id} />
      </div>
    </main>
  );
}
