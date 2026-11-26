import { authApi } from "../auth-api";
import type { Favorite } from "./models";

interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite;
}

export async function createFavorite(
  movieId: number,
): Promise<Favorite> {
  const response = await authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<CreateFavoriteResponse>();

  return response.result;
}