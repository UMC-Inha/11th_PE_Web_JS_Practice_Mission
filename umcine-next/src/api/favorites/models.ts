export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}