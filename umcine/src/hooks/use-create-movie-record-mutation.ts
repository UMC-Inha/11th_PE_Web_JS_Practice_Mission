import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovieRecord } from "../api/movie-records/create-movie-record";
import { MY_FAVORITES_QUERY_KEY } from "../api/favorites/get-my-favorites";
import { MEMBER_RATINGS_QUERY_KEY } from "../api/ratings/get-member-ratings";

export function useCreateMovieRecordMutation(memberId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovieRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: MEMBER_RATINGS_QUERY_KEY(memberId),
      });
      if (data.favorite) {
        queryClient.invalidateQueries({ queryKey: MY_FAVORITES_QUERY_KEY });
      }
      alert("영화 기록을 저장했어요.");
    },
    onError: () => {
      alert("영화 기록 저장에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
