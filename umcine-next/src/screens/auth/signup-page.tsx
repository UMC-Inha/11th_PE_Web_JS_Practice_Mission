"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

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

const inputClassName =
  "h-[49px] w-full rounded-lg border border-[#DDE1E6] bg-white px-4 text-sm text-[#191B20] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const signupMutation = useSignupMutation();

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

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
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (signupMutation.isPending) return;

    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;

    if (
      !isValid ||
      duplicateCheck[key].isChecking ||
      signupMutation.isPending
    ) {
      return;
    }

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable,
        },
      }));

      window.alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable: false,
        },
      }));

      window.alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isChecking: false,
        },
      }));
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex w-full flex-1 items-center justify-center bg-[#F6F7F9] px-5 py-16">
      <form
        id="signup-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[430px] flex-col gap-4 text-sm text-[#191B20]"
      >
        <h1 className="text-[32px] leading-[41px] font-bold tracking-tight">
          회원가입
        </h1>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-email"
            className="text-[13px] leading-4 font-semibold"
          >
            이메일
          </label>

          <div className="relative">
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              disabled={
                duplicateCheck.email.isChecking || signupMutation.isPending
              }
              value={form.email}
              onChange={(event) =>
                handleChangeField("email", event.target.value)
              }
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "signup-email-error" : undefined
              }
              className={`${inputClassName} pr-24`}
            />

            <button
              type="button"
              disabled={
                !isEmailValid ||
                duplicateCheck.email.isChecking ||
                signupMutation.isPending
              }
              onClick={() => handleCheckDuplicate("email")}
              aria-label="이메일 중복 확인"
              className="absolute inset-y-0 right-4 cursor-pointer text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-xs font-semibold">
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </span>
            </button>
          </div>

          {showEmailError && (
            <p
              id="signup-email-error"
              role="alert"
              className="text-xs leading-4 text-[#F04438]"
            >
              이메일 형식을 확인해 주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-nickname"
            className="text-[13px] leading-4 font-semibold"
          >
            닉네임
          </label>

          <div className="relative">
            <input
              id="signup-nickname"
              name="nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2–12자"
              required
              disabled={
                duplicateCheck.nickname.isChecking || signupMutation.isPending
              }
              value={form.nickname}
              onChange={(event) =>
                handleChangeField("nickname", event.target.value)
              }
              aria-invalid={showNicknameError}
              aria-describedby={
                showNicknameError ? "signup-nickname-error" : undefined
              }
              className={`${inputClassName} pr-24`}
            />

            <button
              type="button"
              disabled={
                !isNicknameValid ||
                duplicateCheck.nickname.isChecking ||
                signupMutation.isPending
              }
              onClick={() => handleCheckDuplicate("nickname")}
              aria-label="닉네임 중복 확인"
              className="absolute inset-y-0 right-4 cursor-pointer text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-xs font-semibold">
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </span>
            </button>
          </div>

          {showNicknameError && (
            <p
              id="signup-nickname-error"
              role="alert"
              className="text-xs leading-4 text-[#F04438]"
            >
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password"
            className="text-[13px] leading-4 font-semibold"
          >
            비밀번호
          </label>

          <div className="flex flex-col gap-1">
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              required
              disabled={signupMutation.isPending}
              value={form.password}
              onChange={(event) =>
                handleChangeField("password", event.target.value)
              }
              aria-invalid={showPasswordError}
              aria-describedby={
                showPasswordError
                  ? "signup-password-hint signup-password-error"
                  : "signup-password-hint"
              }
              className={inputClassName}
            />

            <p
              id="signup-password-hint"
              title="사용 가능한 특수문자: !@#$%^&*"
              className="text-[11px] leading-[13px] text-[#98A2B3]"
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
          </div>

          {showPasswordError && (
            <p
              id="signup-password-error"
              role="alert"
              className="text-xs leading-4 text-[#F04438]"
            >
              비밀번호를 다시 한 번 확인해주세요.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password-confirm"
            className="text-[13px] leading-4 font-semibold"
          >
            비밀번호 확인
          </label>

          <input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            required
            disabled={signupMutation.isPending}
            value={form.passwordConfirm}
            onChange={(event) =>
              handleChangeField("passwordConfirm", event.target.value)
            }
            aria-invalid={showPasswordConfirmError}
            aria-describedby={
              showPasswordConfirmError
                ? "signup-password-confirm-error"
                : undefined
            }
            className={inputClassName}
          />

          {showPasswordConfirmError && (
            <p
              id="signup-password-confirm-error"
              role="alert"
              className="text-xs leading-4 text-[#F04438]"
            >
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || signupMutation.isPending}
          className="h-12 w-full cursor-pointer rounded-lg bg-[#2563EB] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="font-semibold">
            {signupMutation.isPending ? "가입 중" : "가입하기"}
          </span>
        </button>

        <div className="flex items-center justify-center gap-1 text-[13px] leading-4 text-[#667085]">
          <span>이미 계정이 있나요?</span>

          <Link
            href="/login"
            className="text-xs font-semibold text-blue-600 underline underline-offset-2"
          >
            로그인
          </Link>
        </div>
      </form>
    </main>
  );
}
