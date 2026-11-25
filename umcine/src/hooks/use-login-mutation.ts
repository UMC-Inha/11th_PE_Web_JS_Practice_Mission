import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HTTPError } from "ky";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { getErrorMessage } from "../utils/get-error-message";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      // 로그인으로 내 정보 조회 결과가 달라지므로 캐시를 무효화함
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.push("/");
    },
    onError: (error) => {
      // 401: 이메일 또는 비밀번호 불일치
      if (error instanceof HTTPError && error.response.status === 401) {
        alert("이메일 또는 비밀번호가 일치하지 않아요.");
        return;
      }
      alert(getErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
