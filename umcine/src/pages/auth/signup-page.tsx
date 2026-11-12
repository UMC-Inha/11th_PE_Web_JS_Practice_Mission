import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

type SignupForm = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
};

type SignupField = keyof SignupForm;
type SignupErrors = Partial<Record<SignupField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function validate(form: SignupForm): SignupErrors {
  const errors: SignupErrors = {};

  if (!form.email) {
    errors.email = "이메일을 입력해 주세요";
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "올바른 이메일 형식이 아니에요";
  }

  const nickname = form.nickname.trim();
  if (!nickname) {
    errors.nickname = "닉네임을 입력해 주세요";
  } else if (nickname.length < 2 || nickname.length > 12) {
    errors.nickname = "닉네임은 2–12자로 입력해 주세요";
  }

  if (!form.password) {
    errors.password = "비밀번호를 입력해 주세요";
  } else if (!PASSWORD_REGEX.test(form.password)) {
    errors.password =
      "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요";
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = "비밀번호를 한 번 더 입력해 주세요";
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 일치하지 않아요";
  }

  return errors;
}

const inputClass =
  "h-[60px] w-full rounded-xl border bg-white px-5 text-base text-app-text-h outline-none placeholder:text-gray-400";

function DuplicateCheckButton({
  onClick,
  disabled,
  isAvailable,
}: {
  onClick: () => void;
  disabled: boolean;
  isAvailable: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent text-sm font-bold text-app-accent disabled:cursor-not-allowed disabled:opacity-40"
    >
      {isAvailable ? "확인 완료" : "중복 확인"}
    </button>
  );
}

export function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [touched, setTouched] = useState<Record<SignupField, boolean>>({
    email: false,
    nickname: false,
    password: false,
    passwordConfirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const errors = validate(form);
  const isFormValid = Object.keys(errors).length === 0;
  const isEmailValid = !errors.email;
  const isNicknameValid = !errors.nickname;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: SignupField, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
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

  const handleBlur = (field: SignupField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 에러는 한 번 건드린(blur) 필드에만 보여준다
  const errorOf = (field: SignupField) =>
    touched[field] ? errors[field] : undefined;

  const inputProps = (field: SignupField) => ({
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChangeField(field, e.target.value),
    onBlur: () => handleBlur(field),
    "aria-invalid": !!errorOf(field),
    className: cn(
      inputClass,
      errorOf(field)
        ? "border-red-500"
        : "border-gray-200 focus:border-app-accent",
    ),
  });

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
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[538px]"
      >
        <h1 className="mb-4 text-[40px] font-bold leading-tight text-app-text-h">
          회원가입
        </h1>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-3">
            <span className="text-[15px] font-bold text-app-text-h">이메일</span>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                disabled={duplicateCheck.email.isChecking}
                {...inputProps("email")}
                className={cn(inputProps("email").className, "pr-24")}
              />
              <DuplicateCheckButton
                onClick={() => handleCheckDuplicate("email")}
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                isAvailable={duplicateCheck.email.isAvailable}
              />
            </div>
            {errorOf("email") && (
              <span className="-mt-1 text-xs text-red-500">
                {errorOf("email")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-[15px] font-bold text-app-text-h">닉네임</span>
            <div className="relative">
              <input
                type="text"
                placeholder="2–12자"
                disabled={duplicateCheck.nickname.isChecking}
                {...inputProps("nickname")}
                className={cn(inputProps("nickname").className, "pr-24")}
              />
              <DuplicateCheckButton
                onClick={() => handleCheckDuplicate("nickname")}
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                isAvailable={duplicateCheck.nickname.isAvailable}
              />
            </div>
            {errorOf("nickname") && (
              <span className="-mt-1 text-xs text-red-500">
                {errorOf("nickname")}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-[15px] font-bold text-app-text-h">
              비밀번호
            </span>
            <input
              type="password"
              placeholder="8자 이상"
              {...inputProps("password")}
            />
            <span
              className={cn(
                "-mt-1 text-xs",
                errorOf("password") ? "text-red-500" : "text-gray-400",
              )}
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </span>
          </label>

          <label className="flex flex-col gap-3">
            <span className="text-[15px] font-bold text-app-text-h">
              비밀번호 확인
            </span>
            <input
              type="password"
              placeholder="다시 입력"
              {...inputProps("passwordConfirm")}
            />
            {errorOf("passwordConfirm") && (
              <span className="-mt-1 text-xs text-red-500">
                {errorOf("passwordConfirm")}
              </span>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-5 h-[58px] w-full rounded-lg border-none bg-app-accent text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-5 text-center text-sm text-app-text">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-app-accent no-underline">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
