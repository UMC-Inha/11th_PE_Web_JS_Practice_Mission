import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";
import { getErrorMessage } from "../utils/get-error-message";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답이 내 정보 조회와 같은 형태이므로 다시 조회하지 않고 캐시를 직접 갱신함
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: (error) => {
      alert(
        getErrorMessage(error, "내 정보 수정에 실패했어요. 다시 시도해 주세요."),
      );
    },
  });
}
