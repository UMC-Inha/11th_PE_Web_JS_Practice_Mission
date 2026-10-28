import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({
  movie,
}: MovieCardProps) {
  return (
    <article className="relative flex min-w-0 flex-col gap-1 xl:h-[318px]">
      <Link
        to="/movies/$movieId"
        params={{
          movieId: String(movie.id),
        }}
        aria-label={`${movie.title} 상세 보기`}
        className="flex min-w-0 flex-col gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <div className="overflow-hidden rounded-lg">
          <img
            src={movie.posterPath}
            alt=""
            className="aspect-[241.6/274] w-full object-cover xl:h-[274px] xl:aspect-auto"
          />
        </div>

        <div className="h-[22px] pt-[5px]">
          <h2
            title={movie.title}
            className="truncate text-sm leading-[17px] font-bold text-[#191B20]"
          >
            {movie.title}
          </h2>
        </div>
      </Link>

      <BookmarkButton
        movieId={movie.id}
        movieTitle={movie.title}
        iconOnly
      />

      <p className="h-3.5 text-xs leading-3.5 text-gray-400">
        {movie.releaseDate}
      </p>
    </article>
  );
}