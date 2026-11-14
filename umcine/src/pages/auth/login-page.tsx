import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/members/login";
import { useAuthStore } from "../../stores/auth-store";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const navigate = useNavigate();

  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });
      if (!response.accessToken) throw new Error("토큰이 없어요.");
      setAccessToken(response.accessToken);
      navigate({ to: "/" });
    } catch {
      alert("이메일 또는 비밀번호를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "flex min-h-12 w-full items-center gap-[9px] rounded-lg border border-[#E3E6EB] bg-white px-[13px] py-[14px] focus-within:border-[#2563EB]";
  const inputClass =
    "min-w-0 flex-1 px-0.5 py-px text-sm leading-[17px] text-[#17191E] outline-none placeholder:text-[#969DA8]";
  const labelClass = "text-[13px] font-extrabold leading-4 text-[#17191E]";

  return (
    <main className="flex min-h-[933px] items-center justify-center bg-[#F6F7F9] px-4">
      <form
        id="login-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[430px] flex-col items-start gap-4"
      >
        <h1 className="text-[34px] font-bold leading-[41px] tracking-[-1.53px] text-[#17191E]">
          로그인
        </h1>

        {/* 이메일 */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="login-email" className={labelClass}>
            이메일
          </label>
          <div className={fieldClass}>
            <img src="/icons/mail.svg" alt="" className="size-4" />
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="login-password" className={labelClass}>
            비밀번호
          </label>
          <div className={fieldClass}>
            <img src="/icons/lock.svg" alt="" className="size-4" />
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-sm font-extrabold leading-[17px] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>

        <div className="flex w-full items-end justify-center gap-1">
          <span className="text-[13px] leading-4 text-[#606774]">
            처음이신가요?
          </span>
          <Link
            to="/signup"
            className="text-xs font-extrabold leading-[14px] text-[#2563EB]"
          >
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}
