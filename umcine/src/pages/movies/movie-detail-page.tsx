import {
  Link,
  useParams,
} from "@tanstack/react-router";

import RatingPanel from "../../components/movies/rating-panel";
import { useMovies } from "../../contexts/movie-context";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const {
    movies,
    handleToggleBookmark,
  } = useMovies();

  const movie = movies.find(
    (item) =>
      item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-10 py-12">
        <h1 className="text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link
          to="/"
          className="mt-6 inline-block text-blue-600 underline"
        >
          영화 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#F6F7F9]">
      <section className="relative h-[360px] overflow-hidden text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-16 py-8">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-sm font-semibold"
          >
            <span>‹</span>
            영화 목록
          </Link>

          <div className="pb-2">
            <h1 className="text-[42px] font-bold tracking-tight">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm text-gray-200">
              {movie.originalTitle}
            </p>

            <p className="mt-3 text-sm font-semibold">
              {movie.releaseDate}
              {"  "}
              {movie.genres.join(" · ")}
              {"  "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-8 px-16 py-8 xl:grid-cols-[220px_1fr_320px]">
        <div>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div className="pt-1">
          <h2 className="text-xl font-bold">
            {movie.tagline}
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <button
            type="button"
            onClick={() =>
              handleToggleBookmark(movie.id)
            }
            className="mt-6 flex h-11 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-bold text-white"
          >
            <img
              src={
                movie.isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className="h-5 w-5 brightness-0 invert"
            />

            {movie.isBookmarked
              ? "즐겨찾기 해제"
              : "즐겨찾기"}
          </button>
        </div>

        <div className="xl:border-l xl:border-gray-200 xl:pl-8">
          <RatingPanel />
        </div>
      </section>
    </main>
  );
}