import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { MEMBER_RATINGS_QUERY_KEY } from "../api/ratings/get-member-ratings";

export function useCreateRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_RATINGS_QUERY_KEY(memberId),
      });
      alert("평점을 등록했어요.");
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
