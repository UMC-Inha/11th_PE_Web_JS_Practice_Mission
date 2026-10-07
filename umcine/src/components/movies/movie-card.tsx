import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img src={movie.posterPath} alt={movie.title} className="h-[274px] w-full rounded-[10px] object-cover" />
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>

        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <h2 className="w-full mt-[8px] text-[14px] font-bold">
            {movie.title}
          </h2>
        </Link>

      <p className="m-0 text-[12px] text-[#969DA8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
