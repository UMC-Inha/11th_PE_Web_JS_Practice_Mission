import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
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

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-[430px] text-left">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">회원가입</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-email" className="text-sm font-bold text-gray-900">
              이메일
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
              <input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                disabled={duplicateCheck.email.isChecking}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-400"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className="text-xs text-red-500">올바른 이메일 형식이 아니에요.</p>
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
                value={form.nickname}
                disabled={duplicateCheck.nickname.isChecking}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
                className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-400"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="text-xs text-red-500">닉네임은 2~12자로 입력해 주세요.</p>
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
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            <p className={`text-xs ${showPasswordError ? "text-red-500" : "text-gray-400"}`}>
              영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요
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
                value={form.passwordConfirm}
                onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            {showPasswordConfirmError && (
              <p className="text-xs text-red-500">비밀번호가 일치하지 않아요.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white disabled:cursor-default disabled:bg-gray-400"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
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
