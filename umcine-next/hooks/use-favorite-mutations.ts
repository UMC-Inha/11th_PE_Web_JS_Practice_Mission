"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { addFavorite } from "@/api/favorites/add-favorite";
import { deleteFavorite } from "@/api/favorites/delete-favorite";
import { queryKeys } from "@/api/query-keys";

export function useFavoriteMutations(movieId: number) {
  const queryClient = useQueryClient();

  const syncCache = (isFavorite: boolean) => {
    queryClient.setQueryData(queryKeys.favoriteStatus(movieId), isFavorite);
    queryClient.invalidateQueries({ queryKey: queryKeys.favorites, exact: true });
  };

  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),
    onSuccess: () => syncCache(true),
    onError: (error) => {
      if (error instanceof HTTPError && error.response.status === 409) {
        syncCache(true); // 이미 즐겨찾기된 상태이므로 화면만 맞춘다
        return;
      }
      alert("즐겨찾기 등록에 실패했어요.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),
    onSuccess: () => syncCache(false),
    onError: () => alert("즐겨찾기 해제에 실패했어요."),
  });

  return { addMutation, deleteMutation };
}
