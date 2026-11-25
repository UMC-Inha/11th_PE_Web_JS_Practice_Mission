import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";
import { ratingKeys } from "../queries/rating-queries";
import { getErrorMessage } from "../utils/get-error-message";

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      alert("평점을 삭제했어요.");
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
    },
    onError: (error) => {
      alert(getErrorMessage(error, "평점 삭제에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
