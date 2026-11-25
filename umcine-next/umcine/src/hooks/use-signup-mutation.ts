import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
import { useRouter } from "next/navigation";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      // 로그인 페이지가 생겼으므로 가입 후 로그인 페이지로 이동
      router.push("/login");
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
