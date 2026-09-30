import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <div className="app">
        <main className="page">
          <p className="movie-detail__empty">영화를 찾을 수 없어요.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="movie-detail">
        <section className="movie-detail__hero">
          <img
            className="movie-detail__backdrop"
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
          />
          <div className="movie-detail__hero-inner">
            <Link to="/" className="movie-detail__back">
              <img src="/icons/chevron-left.svg" alt="" />
              영화 목록
            </Link>

            <div>
              <h1 className="movie-detail__title">{movie.title}</h1>
              <p className="movie-detail__original">{movie.originalTitle}</p>
              <p className="movie-detail__meta">
                <span>{movie.releaseDate}</span>
                <span>{movie.genres.join(" · ")}</span>
                <span>{movie.runtime}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="movie-detail__body">
          <img
            className="movie-detail__poster"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
          <div className="movie-detail__info">
            <h2 className="movie-detail__tagline">{movie.tagline}</h2>
            <p className="movie-detail__overview">{movie.overview}</p>
          </div>
        </section>
      </main>
    </div>
  );
}