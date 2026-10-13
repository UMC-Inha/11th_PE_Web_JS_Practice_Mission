import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex w-full flex-col items-start gap-1">
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="w-full pt-[5px]  text-sm font-extrabold text-[#17191e]">
          {movie.title}
        </h2>
      </Link>

      <p className="w-full  text-xs font-normal text-[#969da8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}