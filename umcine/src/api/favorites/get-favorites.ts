import { authApi } from "../auth-api";
import type { FavoriteResponse } from "./models";

interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteResponse[];
}

export async function getFavorites(): Promise<FavoriteResponse[]> {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();
  return response.result;
}