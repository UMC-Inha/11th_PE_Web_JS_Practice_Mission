import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import { useAuthStore } from "../stores/auth-store";
import { meQueryKey } from "./use-me-query";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: (response, _body, requestToken) => {
      if (!requestToken || requestToken !== useAuthStore.getState().accessToken) return;
      queryClient.setQueryData(meQueryKey, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
