import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";
import type { Favorite } from "./get-favorites";

export async function addFavorite(movieId: number) {
  const res = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
  return res.result;
}
