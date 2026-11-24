import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

// 내 북마크 목록: 마이페이지와 영화 카드의 북마크 버튼이 같이 씁니다.
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 이 영화를 북마크했나: 영화 상세 화면에서 씁니다.
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 등록과 해제 응답만으로는 목록 전체를 만들 수 없어서,
// ["favorites"]로 시작하는 캐시(목록, 여부)를 모두 낡음 표시해 다시 받아 옵니다.
function useInvalidateFavorites() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["favorites"] });
}

export function useCreateFavoriteMutation() {
  const invalidateFavorites = useInvalidateFavorites();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: invalidateFavorites,
    onError: () => {
      alert("북마크에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteFavoriteMutation() {
  const invalidateFavorites = useInvalidateFavorites();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: invalidateFavorites,
    onError: () => {
      alert("북마크 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}