import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { movies as initialMovies } from "../data/movies";
import type { Movie } from "../types/movie";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../utils/bookmark-storage";

interface MovieContextValue {
  movies: Movie[];
  handleToggleBookmark: (movieId: number) => void;
}

const MovieContext = createContext<MovieContextValue | null>(null);

interface MovieProviderProps {
  children: ReactNode;
}

export function MovieProvider({ children }: MovieProviderProps) {
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(
    () => readBookmarkIds(),
  );

  useEffect(() => {
    saveBookmarkIds(bookmarkedMovieIds);
  }, [bookmarkedMovieIds]);

  const movies: Movie[] = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  function handleToggleBookmark(movieId: number) {
    setBookmarkedMovieIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }

  return (
    <MovieContext value={{ movies, handleToggleBookmark }}>
      {children}
    </MovieContext>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovies는 MovieProvider 안에서 사용해야 합니다.");
  }

  return context;
}