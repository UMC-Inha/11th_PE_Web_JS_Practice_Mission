"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "../api/ratings/ratings";

export const memberRatingsQueryKey = (memberId: number) =>
  ["members", memberId, "ratings"] as const;

export function useMemberRatingsQuery(memberId: number | undefined) {
  return useQuery({
    queryKey:
      memberId === undefined
        ? (["members", "anonymous", "ratings"] as const)
        : memberRatingsQueryKey(memberId),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
  });
}

export function useRatingMutations(memberId: number | undefined) {
  const queryClient = useQueryClient();

  const invalidateRatings = () => {
    if (memberId === undefined) return;

    queryClient.invalidateQueries({
      queryKey: memberRatingsQueryKey(memberId),
    });
  };

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: invalidateRatings,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      ratingId,
      score,
      comment,
    }: {
      ratingId: number;
      score: number;
      comment: string;
    }) => updateRating(ratingId, { score, comment }),
    onSuccess: invalidateRatings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: invalidateRatings,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
