import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetailOptions } from "../../queries/movie-query-options";
import { useFavorite } from "../../hooks/use-favorite";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromToken } from "../../utils/get-member-id-from-token";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";
import { RatingForm } from "../../components/movies/rating-form";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const movieDetailQuery = useQuery(getMovieDetailOptions(parsedMovieId));

  const { isBookmarked, isDisabled, isStatusError, toggleBookmark } =
    useFavorite(parsedMovieId);

  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  const myRatingQuery = useQuery({
    queryKey: ["ratings", "member", memberId, "movie", parsedMovieId],
    enabled: Boolean(accessToken) && memberId !== null && isValidMovieId,
    retry: false,

    queryFn: async () => {
      if (memberId === null) {
        throw new Error("회원 ID를 확인할 수 없어요.");
      }

      let page = 0;
      const size = 10;

      while (true) {
        const ratings = await getMemberRatings(memberId, page, size);

        const rating = ratings.find((item) => item.movieId === parsedMovieId);

        if (rating) return rating;

        if (ratings.length < size) return null;

        page += 1;
      }
    },
  });

  const myRating = myRatingQuery.data;

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return <main>{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  }

  const movie = movieDetailQuery.data;

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-90 overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gray-300">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-5 py-7 text-white">
          <Link to="/" className="text-sm">
            〈 영화 목록
          </Link>
          <div className="mt-auto">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.original_title}</p>
            <p className="mt-2 text-sm">
              {movie.release_date}
              {" · "}
              {movie.genres.map((genre) => genre.name).join(" · ")}
              {" · "}
              {runtimeText}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[240px_minmax(0,1fr)_320px] gap-8 px-5 py-12">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="h-90 w-60 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="grid h-90 w-60 shrink-0 place-items-center rounded-xl bg-gray-300">
            이미지 없음
          </div>
        )}

        <div className="min-w-0">
          <h2 className="text-2xl font-bold">{movie.tagline}</h2>
          <p className="mt-6 leading-7">{movie.overview}</p>
          <button
            type="button"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-pressed={isBookmarked}
            disabled={isDisabled}
            title={
              isStatusError ? "즐겨찾기 상태를 불러오지 못했어요." : undefined
            }
            onClick={toggleBookmark}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="size-5 invert"
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>
        <aside>
  <h2 className="m-0 text-lg font-bold">내 평점</h2>

  {!accessToken ? (
    <p className="mt-3 text-sm text-gray-500">
      로그인 후 평점을 작성할 수 있어요.
    </p>
  ) : memberId === null ? (
    <p className="mt-3 text-sm text-gray-500">
      회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.
    </p>
  ) : myRatingQuery.isPending ? (
    <p className="mt-3 text-sm text-gray-500">
      내 평점을 불러오는 중이에요.
    </p>
  ) : myRatingQuery.isError ? (
    <p className="mt-3 text-sm text-gray-500">
      내 평점을 불러오지 못했어요.
    </p>
  ) : (
    <RatingForm
      key={`${memberId}:${parsedMovieId}:${myRating?.ratingId ?? "new"}:${myRating?.updatedAt ?? ""}`}
      memberId={memberId}
      movieId={parsedMovieId}
      rating={myRating ?? null}
    />
  )}
</aside>
      </section>
    </main>
  );
}
