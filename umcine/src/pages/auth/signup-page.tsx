import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { LABEL_CLASS, INPUT_CLASS, CHECK_BUTTON_CLASS } from "../../constants/form-style";
// import { useNavigate } from "@tanstack/react-router";

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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

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

  // 모든 입력값이 유효한지
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const hasInput = Object.values(form).some((value) => value.length > 0);
  const isSubmitDimmed = hasInput && !canSubmit;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setForm((prev) => ({ ...prev, [key]: value }));
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
      return;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // 로그인 페이지 연결 후 주석 해제
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center bg-[#F5F6F8] px-4 py-20">
      <div className="w-[430px] max-w-full">
        <h1 className="mb-4 text-[30px] font-bold leading-9 text-[#17191E]">
          회원가입
        </h1>

        {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                disabled={duplicateCheck.email.isChecking}
                placeholder="name@example.com"
                className={`${INPUT_CLASS} pl-4 pr-[88px]`}
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className={CHECK_BUTTON_CLASS}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className="text-xs leading-4 text-red-500">
                올바른 이메일 형식이 아니에요
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname" className={LABEL_CLASS}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                disabled={duplicateCheck.nickname.isChecking}
                placeholder="2~12자"
                className={`${INPUT_CLASS} pl-4 pr-[88px]`}
              />
              <button
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
                className={CHECK_BUTTON_CLASS}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="text-xs leading-4 text-red-500">
                닉네임은 2자 이상 12자 이하여야 해요
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={LABEL_CLASS}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="8자 이상"
              className={`${INPUT_CLASS} px-4`}
            />
            <p
              className={`-mt-1 text-xs leading-4 ${
                showPasswordError ? "text-red-500" : "text-[#969DA8]"
              }`}
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirm" className={LABEL_CLASS}>
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              placeholder="다시 입력"
              className={`${INPUT_CLASS} px-4`}
            />
            {showPasswordConfirmError && (
              <p className="text-xs leading-4 text-red-500">
                비밀번호가 일치하지 않아요
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`h-12 rounded-lg bg-[#2563EB] text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed ${
              isSubmitDimmed ? "opacity-50" : "hover:brightness-95"
            }`}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-[#969DA8]">
          이미 계정이 있나요?{" "}
          <a href="/login" className="font-bold text-[#2563EB]">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}