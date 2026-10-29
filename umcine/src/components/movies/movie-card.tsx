import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import BookmarkButton from "./bookmark-button";
import PosterImage from "./poster-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <li className="list-none text-left">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-app-surface">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <PosterImage
            className="block h-full w-full object-cover"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={movie.title}
          />
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>
      <div className="mt-2.5">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <p className="truncate text-[15px] font-bold text-app-text-h">
            {movie.title}
          </p>
        </Link>
        <p className="mt-1 text-[13px] text-app-text">
          {movie.release_date || "개봉일 미정"}
        </p>
      </div>
    </li>
  );
}

export default MovieCard;
