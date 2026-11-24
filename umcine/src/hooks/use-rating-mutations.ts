import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";

// 평점이 바뀌면 내 평점 목록 캐시를 낡음 표시해서 다시 받아 옵니다.
function useInvalidateMyRatings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["ratings", "member"] });
}

export function useCreateRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidateMyRatings();
      alert("평점을 저장했어요.");
    },
    onError: () => {
      alert("평점 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      invalidateMyRatings();
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation() {
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      invalidateMyRatings();
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
