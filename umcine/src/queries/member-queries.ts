import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../api/members/get-me";

export const memberKeys = {
  me: ["members", "me"] as const,
};

export function meQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: memberKeys.me,
    queryFn: async () => (await getMe()).result,
    enabled,
  });
}
