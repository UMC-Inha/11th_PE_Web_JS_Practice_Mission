import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";

type CheckStatus = "idle" | "loading" | "available" | "taken" | "error";

function getStatusClassName(status: CheckStatus) {
  if (status === "available") return "text-green-600";
  if (status === "taken") return "text-red-500";
  return "text-gray-500";
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<CheckStatus>("idle");
  const latestEmail = useRef("");

  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>("idle");
  const latestNickname = useRef("");

  const emailMessage: Partial<Record<CheckStatus, string>> = {
    loading: "확인하는 중이에요.",
    available: "사용 가능한 이메일이에요",
    taken: "이미 사용 중이에요",
    error: "확인에 실패했어요. 다시 시도해 주세요",
  };

  const nicknameMessage: Partial<Record<CheckStatus, string>> = {
    loading: "확인하는 중이에요.",
    available: "사용 가능한 닉네임이에요",
    taken: "이미 사용 중이에요",
    error: "확인에 실패했어요. 다시 시도해 주세요",
  };

  function handleEmailChange(value: string) {
    latestEmail.current = value;
    setEmail(value);
    setEmailStatus("idle");
  }

  function handleNicknameChange(value: string) {
    latestNickname.current = value;
    setNickname(value);
    setNicknameStatus("idle");
  }

  async function handleCheckEmail() {
    const requestedEmail = email;
    if (!requestedEmail) return;

    setEmailStatus("loading");
    try {
      const response = await checkEmail(requestedEmail);
      if (latestEmail.current !== requestedEmail) return;
      setEmailStatus(response.available ? "available" : "taken");
    } catch {
      if (latestEmail.current !== requestedEmail) return;
      setEmailStatus("error");
    }
  }

  async function handleCheckNickname() {
    const requestedNickname = nickname;
    if (!requestedNickname) return;

    setNicknameStatus("loading");
    try {
      const response = await checkNickname(requestedNickname);
      if (latestNickname.current !== requestedNickname) return;
      setNicknameStatus(response.available ? "available" : "taken");
    } catch {
      if (latestNickname.current !== requestedNickname) return;
      setNicknameStatus("error");
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-[430px] text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">회원가입</h1>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-email" className="text-sm font-bold text-gray-900">
              이메일
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                disabled={emailStatus === "loading"}
                onClick={handleCheckEmail}
                className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-400"
              >
                중복 확인
              </button>
            </div>
            {emailStatus !== "idle" && (
              <p className={`text-xs ${getStatusClassName(emailStatus)}`}>
                {emailMessage[emailStatus]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-nickname" className="text-sm font-bold text-gray-900">
              닉네임
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <input
                id="signup-nickname"
                type="text"
                placeholder="2~12자"
                value={nickname}
                onChange={(event) => handleNicknameChange(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                disabled={nicknameStatus === "loading"}
                onClick={handleCheckNickname}
                className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-400"
              >
                중복 확인
              </button>
            </div>
            {nicknameStatus !== "idle" && (
              <p className={`text-xs ${getStatusClassName(nicknameStatus)}`}>
                {nicknameMessage[nicknameStatus]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className="text-sm font-bold text-gray-900">
              비밀번호
            </label>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <input
                id="signup-password"
                type="password"
                placeholder="8자 이상"
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-400">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password-confirm" className="text-sm font-bold text-gray-900">
              비밀번호 확인
            </label>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <input
                id="signup-password-confirm"
                type="password"
                placeholder="다시 입력"
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white"
          >
            가입하기
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600 no-underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
