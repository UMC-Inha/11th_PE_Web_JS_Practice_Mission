import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { Link, useNavigate } from "@tanstack/react-router";

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

    const [duplicateCheck, setDuplicateCheck] = useState({
        email: DEFAULT_DUPLICATE_CHECK,
        nickname: DEFAULT_DUPLICATE_CHECK,
    });

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
            if (response.isSuccess) await navigate({ to: "/login" });
        } catch {
            alert("회원가입에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName =
        "h-[52px] w-full rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm placeholder:text-[#9ca3af] focus:border-blue-600 focus:outline-none disabled:bg-gray-100";
    const labelClassName = "mb-2 block text-sm font-bold";
    const errorClassName = "mt-2 text-xs text-[#ef4444]";
    const duplicateButtonClassName =
        "absolute inset-y-0 right-4 text-xs font-bold text-blue-600 disabled:cursor-default";

    // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
    return (
        <main className="px-5 pb-20 pt-16 sm:pt-[180px]">
            <section className="mx-auto w-full max-w-[460px]" aria-labelledby="signup-title">
                <h1 id="signup-title" className="mb-6 text-[32px] font-bold tracking-tight">
                    회원가입
                </h1>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                        <label htmlFor="email" className={labelClassName}>이메일</label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={(e) => handleChangeField("email", e.target.value)}
                                disabled={duplicateCheck.email.isChecking}
                                aria-invalid={showEmailError}
                                aria-describedby={showEmailError ? "email-error" : undefined}
                                className={`${inputClassName} pr-24`}
                            />
                            <button
                                type="button"
                                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                                onClick={() => handleCheckDuplicate("email")}
                                className={duplicateButtonClassName}
                            >
                                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
                            </button>
                        </div>
                        {showEmailError && (
                            <p id="email-error" role="status" className={errorClassName}>이메일 형식을 확인해 주세요.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nickname" className={labelClassName}>닉네임</label>
                        <div className="relative">
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                autoComplete="nickname"
                                placeholder="2~12자"
                                value={form.nickname}
                                onChange={(e) => handleChangeField("nickname", e.target.value)}
                                disabled={duplicateCheck.nickname.isChecking}
                                aria-invalid={showNicknameError}
                                aria-describedby={showNicknameError ? "nickname-error" : undefined}
                                className={`${inputClassName} pr-24`}
                            />
                            <button
                                type="button"
                                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                                onClick={() => handleCheckDuplicate("nickname")}
                                className={duplicateButtonClassName}
                            >
                                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
                            </button>
                        </div>
                        {showNicknameError && (
                            <p id="nickname-error" role="status" className={errorClassName}>닉네임은 2~12자로 입력해 주세요.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClassName}>비밀번호</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="8자 이상"
                            value={form.password}
                            onChange={(e) => handleChangeField("password", e.target.value)}
                            aria-invalid={showPasswordError}
                            aria-describedby={showPasswordError ? "password-hint password-error" : "password-hint"}
                            className={inputClassName}
                        />
                        <p id="password-hint" className="mt-2 text-xs text-[#9ca3af]">
                            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
                        </p>
                        {showPasswordError && (
                            <p id="password-error" role="status" className={errorClassName}>비밀번호를 다시 한 번 확인해주세요.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="passwordConfirm" className={labelClassName}>비밀번호 확인</label>
                        <input
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="password"
                            autoComplete="new-password"
                            placeholder="다시 입력"
                            value={form.passwordConfirm}
                            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
                            aria-invalid={showPasswordConfirmError}
                            aria-describedby={showPasswordConfirmError ? "password-confirm-error" : undefined}
                            className={inputClassName}
                        />
                        {showPasswordConfirmError && (
                            <p id="password-confirm-error" role="status" className={errorClassName}>비밀번호가 일치하지 않아요.</p>
                        )}
                    </div>


                    <button type="submit" disabled={!canSubmit || isSubmitting} className="h-[50px] w-full rounded-lg bg-blue-600 font-bold text-white enabled:hover:bg-blue-700 disabled:opacity-40"
                    >
                        {isSubmitting ? "가입 중" : "가입하기"}
                    </button>
                </form>
                <p className="mt-6 text-center text-xs text-[#9ca3af]">
                    이미 계정이 있나요?{" "}
                    <Link to="/login" className="font-bold text-blue-600">
                        로그인
                    </Link>
                </p>
            </section>
        </main>
    );
}
