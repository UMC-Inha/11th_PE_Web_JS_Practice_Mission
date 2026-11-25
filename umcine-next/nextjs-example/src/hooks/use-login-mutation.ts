"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { meQueryKey } from "./use-me-query";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      await queryClient.cancelQueries({ queryKey: meQueryKey });
      queryClient.removeQueries({ queryKey: meQueryKey });
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      void queryClient.invalidateQueries({ queryKey: meQueryKey });
      router.push("/");
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
