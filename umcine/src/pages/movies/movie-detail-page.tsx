import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { MovieRatingForm } from "../../components/movies/movie-rating-form";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const containerClass = "mx-auto w-[min(1080px,100%_-_48px)]";

interface BookmarkButtonProps {
  initialBookmarked: boolean;
}

function BookmarkButton({ initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      onClick={() => setIsBookmarked((current) => !current)}
      className={cn(
        "mt-5 inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3.5 text-xs font-bold text-white",
        isBookmarked ? "bg-[#1d4ed8]" : "bg-[#2563EB]",
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="size-3.5 brightness-0 invert"
      />
      즐겨찾기
    </button>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className={cn(containerClass, "py-6")}>
        <p className="text-[#888]">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[300px] overflow-hidden bg-[#111] text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        {/* 글자가 잘 보이도록 왼쪽·아래쪽을 어둡게 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent to-60%"
        />

        <div
          className={cn(
            containerClass,
            "relative flex h-full flex-col justify-between pt-5 pb-7",
          )}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 self-start text-xs font-bold text-white"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="size-3.5 brightness-0 invert"
            />
            영화 목록
          </Link>

          <div>
            <h1 className="mb-2 text-4xl font-extrabold text-white">
              {movie.title}
            </h1>
            <p className="mb-2 text-xs">{movie.originalTitle}</p>
            <p className="flex flex-wrap gap-2 text-xs font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div
        className={cn(
          containerClass,
          "flex flex-col gap-8 pt-5 pb-[60px] lg:flex-row",
        )}
      >
        <section className="flex flex-1 flex-col items-start gap-7 sm:flex-row">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-[168px] shrink-0 rounded-lg object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
          />
          <div>
            <h2 className="mb-3 text-[17px] font-extrabold">{movie.tagline}</h2>
            <p className="text-xs leading-[1.8] whitespace-pre-line text-[#555]">
              {movie.overview}
            </p>
            <BookmarkButton
              key={movie.id}
              initialBookmarked={movie.isBookmarked}
            />
          </div>
        </section>

        <aside className="shrink-0 lg:w-[276px] lg:border-l lg:border-[#e5e7eb] lg:pl-6">
          <MovieRatingForm key={movie.id} />
        </aside>
      </div>
    </main>
  );
}