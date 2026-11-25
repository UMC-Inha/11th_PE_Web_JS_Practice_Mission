import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import {
  checkNicknameDuplicate,
  isReservedNickname,
} from "../../api/members/check-nickname-duplicate";
import { Link, useRouter } from "@tanstack/react-router";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import { cn } from "../../utils/cn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const signupMutation = useSignupMutation();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const nickname = form.nickname.trim();
  const isNicknameReserved = isReservedNickname(nickname);
  const isNicknameValid =
    nickname.length >= 2 && nickname.length <= 12 && !isNicknameReserved;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const errors: Record<FormKey, string | null> = {
    email:
      form.email.length > 0 && !isEmailValid
        ? "이메일 형식을 확인해 주세요."
        : null,
    nickname:
      form.nickname.length > 0 && !isNicknameValid
        ? isNicknameReserved
          ? "점 하나 또는 두 개만으로 된 닉네임은 사용할 수 없어요."
          : "닉네임은 2~12자로 입력해 주세요."
        : null,
    password:
      form.password.length > 0 && !isPasswordValid
        ? "비밀번호를 다시 한 번 확인해주세요."
        : null,
    passwordConfirm:
      form.passwordConfirm.length > 0 && !isPasswordConfirmValid
        ? "비밀번호가 일치하지 않아요."
        : null,
  };

  const fields: {
    key: FormKey;
    label: string;
    type: "email" | "text" | "password";
    placeholder: string;
    autoComplete: string;
  }[] = [
    {
      key: "email",
      label: "이메일",
      type: "email",
      placeholder: "name@example.com",
      autoComplete: "email",
    },
    {
      key: "nickname",
      label: "닉네임",
      type: "text",
      placeholder: "2~12자",
      autoComplete: "nickname",
    },
    {
      key: "password",
      label: "비밀번호",
      type: "password",
      placeholder: "8자 이상",
      autoComplete: "new-password",
    },
    {
      key: "passwordConfirm",
      label: "비밀번호 확인",
      type: "password",
      placeholder: "다시 입력",
      autoComplete: "new-password",
    },
  ];

  function handleChangeField(key: FormKey, value: string) {
    if (signupMutation.isPending) return;
    setSubmitError("");
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking || signupMutation.isPending)
      return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((previous) => ({
      ...previous,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available === true;
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((previous) => ({
        ...previous,
        [key]: { ...previous[key], isChecking: false },
      }));
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    setSubmitError("");
    const submissionLocation = router.latestLocation;
    const showFailure = (message: string) => {
      if (router.latestLocation !== submissionLocation) return;
      setDuplicateCheck({
        email: DEFAULT_DUPLICATE_CHECK,
        nickname: DEFAULT_DUPLICATE_CHECK,
      });
      setSubmitError(message);
    };

    signupMutation.mutate(
      { email: form.email.trim(), nickname, password: form.password },
      {
        onSuccess: (response) => {
          if (router.latestLocation !== submissionLocation) return;
          if (!response.isSuccess) {
            showFailure(response.message);
            return;
          }
          alert(response.message);
          void router.navigate({ to: "/login" });
        },
        onError: () => {
          showFailure(
            "회원가입에 실패했어요. 중복 확인 후 다시 시도해 주세요.",
          );
        },
      },
    );
  }

  return (
    <main className="flex flex-1 justify-center px-5 pt-10 pb-20 sm:pt-20 lg:pt-26">
      <section className="w-full max-w-108" aria-labelledby="signup-title">
        <h1
          id="signup-title"
          className="mb-5 text-[32px] font-bold tracking-tight"
        >
          회원가입
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {fields.map((field) => {
            const inputId = `signup-${field.key}`;
            const error = errors[field.key];
            const duplicateKey =
              field.key === "email" || field.key === "nickname"
                ? field.key
                : null;
            const isChecking = duplicateKey
              ? duplicateCheck[duplicateKey].isChecking
              : false;
            const isDuplicateInputValid =
              duplicateKey === "email" ? isEmailValid : isNicknameValid;
            const descriptionId =
              [
                error ? inputId + "-error" : null,
                field.key === "password" ? "signup-password-hint" : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined;
            return (
              <div key={field.key}>
                <label
                  htmlFor={inputId}
                  className="mb-2 block text-sm font-semibold"
                >
                  {field.label}
                </label>
                <div
                  className={cn(
                    "flex min-h-12 items-center rounded-lg border bg-white focus-within:ring-2",
                    error
                      ? "border-red-500 focus-within:ring-red-200"
                      : "border-[#dce1e8] focus-within:border-[#2864fa] focus-within:ring-blue-100",
                  )}
                >
                  <input
                    id={inputId}
                    name={field.key}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(event) =>
                      handleChangeField(field.key, event.target.value)
                    }
                    disabled={isChecking || signupMutation.isPending}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={descriptionId}
                    className="min-w-0 flex-1 rounded-lg bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#939baa] focus-visible:outline-none"
                  />
                  {duplicateKey && (
                    <button
                      type="button"
                      disabled={
                        !isDuplicateInputValid ||
                        isChecking ||
                        signupMutation.isPending
                      }
                      onClick={() => handleCheckDuplicate(duplicateKey)}
                      className="shrink-0 rounded px-3 py-2 text-xs font-bold text-[#2864fa] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isChecking ? "확인 중" : "중복 확인"}
                    </button>
                  )}
                </div>
                {error && (
                  <p
                    id={`${inputId}-error`}
                    role="alert"
                    className="mt-1.5 text-xs leading-5 text-red-600"
                  >
                    {error}
                  </p>
                )}
                {field.key === "password" && (
                  <p
                    id="signup-password-hint"
                    className="mt-1.5 text-xs leading-5 text-[#939baa]"
                  >
                    영문 대소문자, 숫자, 특수문자(!@#$%^&amp;*)를 모두 포함해
                    8자 이상 입력해 주세요.
                  </p>
                )}
              </div>
            );
          })}
          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || signupMutation.isPending}
            className={cn(
              "h-12 w-full rounded-lg text-sm font-bold text-white",
              canSubmit && !signupMutation.isPending
                ? "bg-[#2864fa] hover:bg-blue-700"
                : "cursor-not-allowed bg-[#2864fa]/45",
            )}
          >
            {signupMutation.isPending ? "가입 중" : "가입하기"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#788191]">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-[#2864fa]">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}
