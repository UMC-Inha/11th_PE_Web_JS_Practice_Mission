import { authApi } from "../auth-api";

export async function deleteFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
