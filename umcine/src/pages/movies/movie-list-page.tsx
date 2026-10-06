import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="flex min-h-[calc(100vh-148px)] flex-col gap-5 bg-[#f5f6f8] px-[max(80px,calc((100%_-_1280px)/2))] py-6">
      <h1 className="text-2xl font-bold">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination />
    </main>
  );
}