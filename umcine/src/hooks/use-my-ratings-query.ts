import { useQuery } from "@tanstack/react-query";
import {
  getMemberRatings,
  MEMBER_RATINGS_QUERY_KEY,
} from "../api/ratings/get-member-ratings";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id-from-token";

// 로그인한 회원이 남긴 평점 목록
export function useMyRatingsQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  const ratingsQuery = useQuery({
    queryKey: MEMBER_RATINGS_QUERY_KEY(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });

  return { memberId, ratingsQuery };
}
