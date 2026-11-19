import { authApi } from "../auth-api";
import type {
  Rating,
  RatingInput,
  SaveRatingResponse,
} from "./models";

export async function updateRating(
  ratingId: number,
  body: RatingInput,
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, {
      json: body,
    })
    .json<SaveRatingResponse>();

  return response.result;
}