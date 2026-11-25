"use client";

import Image from "next/image";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLoginMutation();

  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex w-full flex-1 items-center justify-center px-5 py-16">
      <form
        className="flex w-full max-w-[430px] flex-col gap-4 text-sm"
        onSubmit={handleSubmit}
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
              <Image
                src="/icons/mail.svg"
                width={16}
                height={16}
                alt=""
                className="h-[10.67px] w-[13.33px]"
              />
            </span>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, email: event.target.value }));
                loginMutation.reset();
              }}
              disabled={loginMutation.isPending}
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
              <Image
                src="/icons/lock.svg"
                width={16}
                height={16}
                alt=""
                className="h-[14px] w-[10.67px]"
              />
            </span>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, password: event.target.value }));
                loginMutation.reset();
              }}
              disabled={loginMutation.isPending}
              required
              placeholder="비밀번호를 입력해 주세요."
              className="h-full min-w-0 flex-1 bg-transparent text-sm! outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="h-12 cursor-pointer rounded-lg bg-blue-600 text-sm! font-bold! text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="text-center leading-[21px] text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="ml-1 font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
