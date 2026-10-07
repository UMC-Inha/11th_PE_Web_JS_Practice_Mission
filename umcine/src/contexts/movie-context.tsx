import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from "react";
  
  import {
    movies as initialMovies,
  } from "../data/movies";
  
  import type { Movie } from "../types/movie";
  
  interface MovieContextValue {
    movies: Movie[];
    handleToggleBookmark: (movieId: number) => void;
  }
  
  const MovieContext =
    createContext<MovieContextValue | null>(null);
  
  interface MovieProviderProps {
    children: ReactNode;
  }
  
  export function MovieProvider({
    children,
  }: MovieProviderProps) {
    const [movies, setMovies] =
      useState<Movie[]>(initialMovies);
  
    function handleToggleBookmark(
      movieId: number,
    ) {
      setMovies((currentMovies) =>
        currentMovies.map((movie) =>
          movie.id === movieId
            ? {
                ...movie,
                isBookmarked:
                  !movie.isBookmarked,
              }
            : movie,
        ),
      );
    }
  
    return (
      <MovieContext
        value={{
          movies,
          handleToggleBookmark,
        }}
      >
        {children}
      </MovieContext>
    );
  }
  
  export function useMovies() {
    const context =
      useContext(MovieContext);
  
    if (!context) {
      throw new Error(
        "useMovies는 MovieProvider 안에서 사용해야 합니다.",
      );
    }
  
    return context;
  }