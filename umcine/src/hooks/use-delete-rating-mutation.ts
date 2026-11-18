import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";
import { MEMBER_RATINGS_QUERY_KEY } from "../api/ratings/get-member-ratings";

export function useDeleteRatingMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_RATINGS_QUERY_KEY(memberId),
      });
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
