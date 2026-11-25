import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRating } from "../api/ratings/update-rating";
import { ratingKeys } from "../queries/rating-queries";
import { getErrorMessage } from "../utils/get-error-message";

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: () => {
      alert("평점을 수정했어요.");
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
    },
    onError: (error) => {
      alert(getErrorMessage(error, "평점 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
