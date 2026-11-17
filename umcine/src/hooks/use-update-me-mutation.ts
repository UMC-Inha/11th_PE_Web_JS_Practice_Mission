import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onMutate: () => ({ token: useAuthStore.getState().accessToken }),
    onSuccess: async (response, _variables, context) => {
      if (!context?.token || useAuthStore.getState().accessToken !== context.token) return;

      // 진행 중인 조회 응답이 수정된 캐시를 덮어쓰지 않도록 취소해요.
      await queryClient.cancelQueries({ queryKey: ["members", "me"] });
      if (useAuthStore.getState().accessToken !== context.token) return;

      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
