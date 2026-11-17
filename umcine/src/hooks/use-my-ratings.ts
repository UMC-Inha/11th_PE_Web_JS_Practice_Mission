import { useQuery } from "@tanstack/react-query";
import { getMyRatings } from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";

export function useMyRatings() {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["ratings", "me", token],
    queryFn: ({ signal }) => getMyRatings(signal),
    enabled: Boolean(token),
    retry: false,
  });
}
