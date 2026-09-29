import { useState } from "react";
import "./App.css";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import MovieGrid from "./components/movies/movie-grid";
import Pagination from "./components/movies/pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination/>
      </main>

      <Footer/>
    </div>
  );
}