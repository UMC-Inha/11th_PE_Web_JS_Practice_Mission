import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LockIcon, MailIcon } from "../../components/icons";

const DEFAULT_LOGIN_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_LOGIN_FORM;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_LOGIN_FORM);

  // 둘 다 입력해야 로그인 버튼 활성화
  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#4f5de8]";
  const iconClass = "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400";
  const labelClass = "mb-2 block text-xs font-semibold";

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-20">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-6 text-3xl font-bold">로그인</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>이메일</label>
            <div className="relative">
              <MailIcon className={iconClass} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={inputClass}
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>비밀번호</label>
            <div className="relative">
              <LockIcon className={iconClass} />
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className={inputClass}
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-11 rounded-lg bg-[#4f5de8] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-[#4f5de8]">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}