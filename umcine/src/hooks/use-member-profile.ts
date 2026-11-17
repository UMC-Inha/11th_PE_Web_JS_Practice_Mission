import { useQuery } from "@tanstack/react-query";
import { getMemberProfile } from "../api/members/member-profile";
import { useAuthStore } from "../stores/auth-store";

export function useMemberProfile() {
  const token = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    queryKey: ["member", token],
    queryFn: ({ signal }) => getMemberProfile(token!, signal),
    enabled: Boolean(token),
    retry: false,
  });
  return { ...query, token };
}
