type TmdbMovieListItem = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
};

type TmdbMovieListResponse = {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
};

type TmdbMovieDetail = Omit<TmdbMovieListItem, "genre_ids"> & {
  tagline: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
};

export type { TmdbMovieDetail, TmdbMovieListItem, TmdbMovieListResponse };
