import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-[#F6F7F9] px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[384px] flex-col gap-4"
      >
        <h1 className="text-4xl font-bold text-[#17191E]">
          로그인
        </h1>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs font-extrabold text-[#17191E]"
          >
            이메일
          </label>

          <div className="flex h-12 items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-3">
            <img
              src="/icons/mail.svg"
              alt=""
              className="h-4 w-4 shrink-0"
            />

            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#969DA8]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-xs font-extrabold text-[#17191E]"
          >
            비밀번호
          </label>

          <div className="flex h-12 items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-3">
            <img
              src="/icons/lock.svg"
              alt=""
              className="h-4 w-4 shrink-0"
            />

            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#969DA8]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-12 rounded-lg bg-[#2563EB] text-sm font-extrabold text-white"
        >
          로그인
        </button>

        <div className="flex justify-center pt-[5px] text-xs">
          <span className="text-[#606774]">
            처음이신가요?{" "}
          </span>
          <Link
            to="/signup"
            className="ml-1 font-extrabold text-[#2563EB]">
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}
