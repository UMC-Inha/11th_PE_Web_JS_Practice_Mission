import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-1 xl:h-[318px]">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[241.6/274] w-full object-cover xl:h-[274px] xl:aspect-auto"
        />

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          iconOnly
        />
      </div>

      <div className="h-[22px] pt-[5px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block"
        >
          <h2
            title={movie.title}
            className="truncate text-sm leading-[17px] font-bold text-[#191B20]"
          >
            {movie.title}
          </h2>
        </Link>
      </div>

      <p className="h-3.5 text-xs leading-3.5 text-gray-400">
        {movie.releaseDate}
      </p>
    </article>
  );
}