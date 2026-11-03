import { Link } from "@tanstack/react-router";

export function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-[430px] text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">로그인</h1>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-sm font-bold text-gray-900">
              이메일
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <img src="/icons/mail.svg" alt="" className="size-4 shrink-0" />
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-sm font-bold text-gray-900">
              비밀번호
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <img src="/icons/lock.svg" alt="" className="size-4 shrink-0" />
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호"
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white"
          >
            로그인
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          처음이신가요?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 no-underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
