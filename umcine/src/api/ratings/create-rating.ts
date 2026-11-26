import { authApi } from "../auth-api";
import type {
  CreateRatingRequest,
  Rating,
  SaveRatingResponse,
} from "./models";

export async function createRating(
  body: CreateRatingRequest,
): Promise<Rating> {
  const response = await authApi
    .post("ratings", {
      json: body,
    })
    .json<SaveRatingResponse>();

  return response.result;
}