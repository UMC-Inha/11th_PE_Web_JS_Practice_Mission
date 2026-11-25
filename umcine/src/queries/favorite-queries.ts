import { queryOptions } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: ["favorites", "list"] as const,
  status: (movieId: number) => ["favorites", "status", movieId] as const,
};

// 목록 전체: 마이페이지와 영화 목록의 북마크 버튼이 함께 사용함
export function favoritesQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: favoriteKeys.list,
    queryFn: getFavorites,
    enabled,
    retry: false,
  });
}

// 영화 한 편의 즐겨찾기 여부: 영화 상세에서 사용함
export function favoriteStatusQueryOptions(movieId: number, enabled: boolean) {
  return queryOptions({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled,
    retry: false,
  });
}
