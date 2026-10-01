import {
    Link,
    useParams,
  } from "@tanstack/react-router";
  
  import { movies } from "../../data/movies";
  
  export function MovieDetailPage() {
    const { movieId } = useParams({
      from: "/movies/$movieId",
    });
  
    const movie = movies.find(
      (item) =>
        item.id === Number(movieId),
    );
  
    if (!movie) {
      return (
        <main className="container movie-page">
          <h1>
            영화를 찾을 수 없어요.
          </h1>
  
          <Link to="/">
            영화 목록으로
          </Link>
        </main>
      );
    }
  
    return (
      <main className="container movie-page">
        <Link to="/">
          영화 목록
        </Link>
  
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          width="640"
        />
  
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          width="200"
        />
  
        <h1>
          {movie.title}
        </h1>
  
        <p>
          {movie.originalTitle}
        </p>
  
        <p>
          {movie.releaseDate}
        </p>
  
        <p>
          {movie.genres.join(" · ")}
        </p>
  
        <p>
          {movie.runtime}
        </p>
  
        <h2>
          {movie.tagline}
        </h2>
  
        <p>
          {movie.overview}
        </p>
      </main>
    );
  }