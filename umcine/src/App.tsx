import { useState } from "react";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies } from "./data/movies";
import type { Movie } from "./types/movie";
import "./App.css";

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  function handleBookmarkToggle(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="movie-list-page">
        <div className="page-heading">
          <h1>영화 목록</h1>
        </div>
        <MovieGrid movies={movieList} onBookmarkToggle={handleBookmarkToggle} />
        <Pagination currentPage={1} totalPages={3} />
      </main>
      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
