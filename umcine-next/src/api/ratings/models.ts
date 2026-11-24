export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}
