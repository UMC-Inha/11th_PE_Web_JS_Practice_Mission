import { authApi } from "../auth-api";
import type { FavoriteResponse } from "./models";

interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteResponse;
}

export function createFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<CreateFavoriteResponse>();
}