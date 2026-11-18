import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";


// 이메일 형식 검사
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

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
// const navigate = useNavigate();

  const [duplicateCheck, setDuplicateCheck] = useState({
  email: DEFAULT_DUPLICATE_CHECK,
  nickname: DEFAULT_DUPLICATE_CHECK,
});

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

    const canSubmit =
  isFormValid &&
  duplicateCheck.email.isAvailable &&
  duplicateCheck.nickname.isAvailable;

  const handleChangeField = (
  key: DefaultFormKey,
  value: DefaultFormValue,
) => {
  if (key === "email" || key === "nickname") {
    if (duplicateCheck[key].isChecking) return;

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: DEFAULT_DUPLICATE_CHECK,
    }));
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    // 로그인 페이지 연결 후 주석 해제
    // navigate({ to: "/login" });
  } catch {
    alert("회원가입에 실패했어요. 다시 시도해 주세요.");
  } finally {
    setIsSubmitting(false);
  }
};


  const inputClassName =
  "h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none placeholder:text-[#98a2b3] focus:border-blue-600";

const labelClassName =
  "mb-2 block text-xs font-bold text-[#17191f]";

const errorClassName =
  "mt-1 text-xs text-red-500";

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
 return (
  <main className="flex flex-1 items-center justify-center bg-[#f6f7f9] px-5 py-12">
    <form
      className="w-full max-w-[430px]"
      onSubmit={handleSubmit}
      noValidate
    >
      <h1 className="mb-5 text-[32px] leading-10 font-bold tracking-tight">
        회원가입
      </h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="signup-email" className={labelClassName}>
            이메일
          </label>

          <div className="flex h-12 items-center rounded-lg border border-[#dfe3ea] bg-white px-4 focus-within:border-blue-600">
            <input
              id="signup-email"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) => handleChangeField("email", e.target.value)}
            />

            <button
              className="ml-3 shrink-0 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed"
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
  onClick={() => handleCheckDuplicate("email")}

            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {showEmailError && (
            <p className={errorClassName}>
              올바른 이메일 형식을 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-nickname" className={labelClassName}>
            닉네임
          </label>

          <div className="flex h-12 items-center rounded-lg border border-[#dfe3ea] bg-white px-4 focus-within:border-blue-600">
            <input
              id="signup-nickname"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
              type="text"
              placeholder="2–12자"
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) =>
                handleChangeField("nickname", e.target.value)
              }
            />

            <button
              className="ml-3 shrink-0 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed"
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
  onClick={() => handleCheckDuplicate("nickname")}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {showNicknameError && (
            <p className={errorClassName}>
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-password" className={labelClassName}>
            비밀번호
          </label>

          <input
            id="signup-password"
            className={inputClassName}
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) =>
              handleChangeField("password", e.target.value)
            }
          />

          <p
            className={
              showPasswordError
                ? errorClassName
                : "mt-1 text-[10px] text-[#98a2b3]"
            }
          >
            영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해
            8자 이상 입력해 주세요.
          </p>
        </div>

        <div>
          <label
            htmlFor="signup-password-confirm"
            className={labelClassName}
          >
            비밀번호 확인
          </label>

          <input
            id="signup-password-confirm"
            className={inputClassName}
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
          />

          {showPasswordConfirmError && (
            <p className={errorClassName}>
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>
      </div>

      <button
        className="mt-4 h-12 w-full rounded-lg bg-[#2563eb] text-sm font-bold text-white disabled:cursor-not-allowed"
        type="submit"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "가입중" : "가입하기"}
      </button>

      <p className="mt-4 text-center text-xs text-[#667085]">
        이미 계정이 있나요?{" "}
        <button
          className="font-semibold text-blue-600"
          type="button"
        >
          로그인
        </button>
      </p>
    </form>
  </main>
);
}
