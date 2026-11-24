import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/get-member-id-from-token";

export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? getMemberIdFromToken(accessToken) : null;
}
