import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite } from "../api/favorites/add-favorite";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { favoriteKeys } from "../queries/favorite-queries";
import { useAuthStore } from "../stores/auth-store";
import { getErrorMessage } from "../utils/get-error-message";

interface ToggleVariables {
  movieId: number;
  isFavorite: boolean; // 토글하기 전의 상태
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ movieId, isFavorite }: ToggleVariables) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: (_, { movieId, isFavorite }) => {
      // 영화 상세의 여부 조회는 결과를 알고 있으니 캐시를 직접 바꾸고
      queryClient.setQueryData<boolean>(favoriteKeys.status(movieId), !isFavorite);
      // 목록은 항목이 늘고 줄었으니 다시 조회함
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list });
    },
    onError: (error) => {
      alert(
        getErrorMessage(error, "즐겨찾기 처리에 실패했어요. 다시 시도해 주세요."),
      );
    },
  });

  const toggle = (movieId: number, isFavorite: boolean) => {
    // 로그인하지 않았다면 로그인 페이지로 안내함
    if (!useAuthStore.getState().accessToken) {
      navigate({ to: "/login" });
      return;
    }
    if (mutation.isPending) return;
    mutation.mutate({ movieId, isFavorite });
  };

  return { toggle, isPending: mutation.isPending };
}
