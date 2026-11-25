import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { ratingKeys } from "../queries/rating-queries";
import { getErrorMessage } from "../utils/get-error-message";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      alert("평점을 등록했어요.");
      // 응답에는 ratingId만 있어서 평점 목록을 다시 조회함
      queryClient.invalidateQueries({ queryKey: ratingKeys.all });
    },
    onError: (error) => {
      alert(getErrorMessage(error, "평점 등록에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
