export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export interface CreateRatingRequest extends RatingInput {
  movieId: number;
}

export interface SaveRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}