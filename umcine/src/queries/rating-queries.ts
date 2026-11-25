import { queryOptions } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";

export const ratingKeys = {
  all: ["ratings"] as const,
  member: (memberId: number) => ["ratings", "member", memberId] as const,
};

export function memberRatingsQueryOptions(
  memberId: number | null,
  enabled: boolean,
) {
  return queryOptions({
    queryKey: ratingKeys.member(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: enabled && memberId !== null,
    retry: false,
  });
}
