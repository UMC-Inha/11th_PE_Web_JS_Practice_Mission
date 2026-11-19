import { authApi } from "../auth-api";
import type { Rating } from "./models";

export function getMemberRatings(
  memberId: number,
  page = 0,
  size = 10,
): Promise<Rating[]> {
  return authApi
    .get(`members/${memberId}/ratings`, {
      searchParams: { page, size },
    })
    .json<Rating[]>();
}