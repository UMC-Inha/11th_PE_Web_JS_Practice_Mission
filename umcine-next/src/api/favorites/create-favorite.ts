import { authApi } from "../auth-api";
import type { ApiResponse, Favorite } from "./models";

export function createFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}