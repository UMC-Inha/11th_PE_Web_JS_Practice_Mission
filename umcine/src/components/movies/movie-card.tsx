import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border",
            movie.isBookmarked ? "border-[#4f5de8] bg-[#4f5de8]" : "border-white bg-black/40",
          )}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
            className="h-4 w-4 brightness-0 invert"
          />
        </button>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2.5 text-sm font-semibold">{movie.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}