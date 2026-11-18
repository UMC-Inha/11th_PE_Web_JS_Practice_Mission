import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LABEL_CLASS, INPUT_CLASS } from "../../constants/form-style";

const DEFAULT_FORM = { email: "", password: "" };

type DefaultFormKey = keyof typeof DEFAULT_FORM;

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const canSubmit = form.email.length > 0 && form.password.length > 0;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F6F8] px-20 py-6">
      <div className="w-[430px] max-w-full">
        <h1 className="mb-4 text-[30px] font-bold leading-9 text-[#17191E]">
          로그인
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              이메일
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#969DA8]">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                placeholder="name@example.com"
                className={`${INPUT_CLASS} pl-11 pr-4`}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={LABEL_CLASS}>
              비밀번호
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#969DA8]">
                <LockIcon />
              </span>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                placeholder="비밀번호"
                className={`${INPUT_CLASS} pl-11 pr-4`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`h-12 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed ${
              canSubmit ? "hover:brightness-95" : "opacity-50"
            }`}
          >
            로그인
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-[#969DA8]">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-[#2563EB]">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}