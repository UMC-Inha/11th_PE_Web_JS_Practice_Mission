import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/auth-member";
import { useAuthStore } from "../../stores/auth-store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, message } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const loginControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => loginControllerRef.current?.abort();
  }, []);

  const mutation = useMutation({
    mutationFn: (variables: {
      email: string;
      password: string;
      signal: AbortSignal;
    }) => login(variables.email, variables.password, variables.signal),
    onSuccess: async (result, variables) => {
      if (variables.signal.aborted) {
        return;
      }

      await queryClient.cancelQueries({
        queryKey: ["member"],
      });

      if (variables.signal.aborted) {
        return;
      }

      queryClient.removeQueries({
        queryKey: ["member"],
      });

      signIn(result.accessToken);
      setPassword("");

      await navigate({
        to: "/mypage",
      });
    },
  });

  const canSubmit =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length > 0;

  return (
    <main className="flex w-full flex-1 items-center justify-center px-5 py-16">
      <form
        className="flex w-full max-w-[430px] flex-col gap-4 text-sm"
        onSubmit={(event) => {
          event.preventDefault();

          if (canSubmit && !mutation.isPending) {
            loginControllerRef.current?.abort();
            const controller = new AbortController();
            loginControllerRef.current = controller;

            mutation.mutate({
              email,
              password,
              signal: controller.signal,
            });
          }
        }}
      >
        <h1 className="text-[32px] leading-[41px] font-bold tracking-tight">
          로그인
        </h1>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="text-[13px] leading-4 font-semibold"
          >
            이메일
          </label>

          <div className="flex h-[49px] items-center gap-3 rounded-lg border border-[#DDE1E6] bg-white px-4 focus-within:border-blue-600">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <img
                src="/icons/mail.svg"
                alt=""
                className="h-[10.67px] w-[13.33px]"
              />
            </span>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                mutation.reset();
              }}
              disabled={mutation.isPending}
              required
              placeholder="이메일을 입력해 주세요."
              className="h-full min-w-0 flex-1 bg-transparent text-sm! outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-[13px] leading-4 font-semibold"
          >
            비밀번호
          </label>

          <div className="flex h-[49px] items-center gap-3 rounded-lg border border-[#DDE1E6] bg-white px-4 focus-within:border-blue-600">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <img
                src="/icons/lock.svg"
                alt=""
                className="h-[14px] w-[10.67px]"
              />
            </span>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                mutation.reset();
              }}
              disabled={mutation.isPending}
              required
              placeholder="비밀번호를 입력해 주세요."
              className="h-full min-w-0 flex-1 bg-transparent text-sm! outline-none"
            />
          </div>
        </div>

        {(mutation.error || message) && (
          <p role="alert" className="text-sm text-red-600">
            {mutation.error?.message || message}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || mutation.isPending}
          className="h-12 cursor-pointer rounded-lg bg-blue-600 text-sm! font-bold! text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? "로그인 중…" : "로그인"}
        </button>

        <p className="text-center leading-[21px] text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link to="/signup" className="ml-1 font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}