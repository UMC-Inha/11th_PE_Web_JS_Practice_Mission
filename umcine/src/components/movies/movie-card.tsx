import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article>
      <div className="relative aspect-243/275 overflow-hidden rounded-lg">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full"
        >
          <img src={movie.posterPath} alt={movie.title} className="h-full w-full object-cover" />
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2.5 text-sm font-semibold">{movie.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}