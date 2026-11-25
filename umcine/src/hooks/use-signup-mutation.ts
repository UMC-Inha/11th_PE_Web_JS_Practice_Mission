import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
// import { useRouter } from "next/navigation";

export function useSignupMutation() {
  // const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);

      // 로그인 페이지 연결 후 주석 해제
      // router.push("/login");
    },
    // 실패 메시지는 7주차 코드리뷰 반영으로 alert 대신 폼에 표시함 (signup-page의 signupMutation.isError)
  });
}
