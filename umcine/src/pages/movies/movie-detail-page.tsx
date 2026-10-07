import {
  Link,
  useParams,
} from "@tanstack/react-router";

import RatingPanel from "../../components/movies/rating-panel";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  

  const movie = movies.find(
    (item) =>
      item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="w-full flex-1 px-5 py-12 xl:px-20">
        <h1 className="text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link
          to="/"
          className="mt-5 inline-block text-blue-600 underline"
        >
          영화 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-1 flex-col bg-[#F6F7F9]">
      <section className="relative h-90 w-full shrink-0 overflow-hidden text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <div className="relative flex h-full w-full flex-col justify-between px-5 py-6 xl:px-20">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-sm font-semibold"
          >
            <span>‹</span>
            영화 목록
          </Link>

          <div>
            <h1 className="text-4xl leading-[44px] font-bold tracking-tight">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm text-gray-200">
              {movie.originalTitle}
            </p>

            <p className="mt-2 text-sm font-semibold">
              {movie.releaseDate}
              {"  "}
              {movie.genres.join(" · ")}
              {"  "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-6 px-5 py-6 xl:h-[342px] xl:flex-row xl:px-20">
        <div className="w-50 shrink-0">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-70 w-50 rounded-lg object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">
            {movie.tagline}
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <div className="mt-6">
  <BookmarkButton
    movieId={movie.id}
    movieTitle={movie.title}
  />
</div>
        </div>

        <div className="w-full shrink-0 xl:w-80 xl:border-l xl:border-gray-200 xl:pl-6">
          <RatingPanel />
        </div>
      </section>
    </main>
  );
}