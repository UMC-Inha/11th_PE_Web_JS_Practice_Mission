import { useState } from "react";
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
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <>
      <Header />
      <main className="page">
        <h2 className="page__title">영화 목록</h2>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </main>
      <Footer />
    </>
  );
}