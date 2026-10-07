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
    <article className="min-w-0">
      <div className="relative aspect-[241.6/274] w-full overflow-hidden rounded-[7px] bg-[#ddd]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        </Link>

        <BookmarkButton movieId={movie.id} variant="icon" className="absolute right-2.25 top-2.25" />
      </div>

      <h2 className="mt-2.25 mb-1 truncate text-left text-[13px] font-bold">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-inherit no-underline"
        >
          {movie.title}
        </Link>
      </h2>

      <p className="m-0 text-left text-[11px] text-[#999]">
        {movie.releaseDate}
      </p>
    </article>
  );
}

