import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      await queryClient.cancelQueries({ queryKey: ["members", "me"] });
      queryClient.removeQueries({ queryKey: ["members", "me"] });
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      queryClient.removeQueries({ queryKey: ["favorites"] });
      setAccessToken(response.accessToken);
      alert("로그인에 성공했어요.");
      navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
