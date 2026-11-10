import { useState } from "react";
import { cn } from "../../utils/cn";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { Link, useNavigate } from "@tanstack/react-router";

// 이메일 형식: 글자 + @ + 글자 + . + 글자
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 1단계: 규칙을 만족하나?
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 2단계: 입력을 시작한 칸에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 3단계: 모두 통과하면 버튼 활성화
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#4f5de8]";
  const labelClass = "mb-2 block text-xs font-semibold";
  const checkButtonClass =
    "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4f5de8] disabled:text-gray-300";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-start justify-center bg-gray-50 px-4 py-20">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-6 text-3xl font-bold">회원가입</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>이메일</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={cn(inputClass, "pr-20")}
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                disabled={duplicateCheck.email.isChecking}
              />
              <button
                type="button"
                className={checkButtonClass}
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && <p className={errorClass}>이메일 형식을 확인해 주세요.</p>}
          </div>

          <div>
            <label htmlFor="nickname" className={labelClass}>닉네임</label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                placeholder="2~12자"
                className={cn(inputClass, "pr-20")}
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                disabled={duplicateCheck.nickname.isChecking}
              />
              <button
                type="button"
                className={checkButtonClass}
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && <p className={errorClass}>닉네임은 2~12자로 입력해 주세요.</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              className={inputClass}
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-400">
              영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
            {showPasswordError && <p className={errorClass}>비밀번호를 다시 한 번 확인해주세요.</p>}
          </div>

          <div>
            <label htmlFor="passwordConfirm" className={labelClass}>비밀번호 확인</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              className={inputClass}
              value={form.passwordConfirm}
              onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            />
            {showPasswordConfirmError && <p className={errorClass}>비밀번호가 일치하지 않아요.</p>}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 h-11 rounded-lg bg-[#4f5de8] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-[#4f5de8]">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}