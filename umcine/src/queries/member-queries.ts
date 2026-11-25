import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../api/members/me";

export const memberKeys = {
  me: ["members", "me"] as const,
};

export function meQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: memberKeys.me,
    queryFn: getMe,
    enabled,
    // 내 정보는 자주 바뀌지 않으므로 5분 동안 fresh로 취급함
    staleTime: 5 * 60 * 1000,
    // 401로 토큰이 지워진 뒤 같은 조회를 자동 재시도하지 않음
    retry: false,
  });
}
