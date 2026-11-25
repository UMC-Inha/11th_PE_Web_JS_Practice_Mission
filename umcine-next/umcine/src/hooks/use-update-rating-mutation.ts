import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRating } from "../api/ratings/update-rating";
import { MEMBER_RATINGS_QUERY_KEY } from "../api/ratings/get-member-ratings";

export function useUpdateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ratingId,
      ...body
    }: { ratingId: number; score: number; comment?: string }) =>
      updateRating(ratingId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_RATINGS_QUERY_KEY(memberId),
      });
      alert("평점을 수정했어요.");
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
