import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import type { MemberInfo } from "../../api/members/get-me";
import { updateMe } from "../../api/members/update-me";
import { memberKeys, meQueryOptions } from "../../queries/member-queries";
import { useAuthStore } from "../../stores/auth-store";
import { getErrorMessage } from "../../utils/get-error-message";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-app-text-h outline-none focus:border-app-accent";

function MyPageEditForm({ me }: { me: MemberInfo }) {
  const [nickname, setNickname] = useState(me.nickname);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setStoredNickname = useAuthStore((state) => state.setNickname);

  const trimmed = nickname.trim();
  const isNicknameValid = trimmed.length >= 2 && trimmed.length <= 12;
  const isChanged = trimmed !== me.nickname;

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: updateMe,
    onSuccess: async ({ result }) => {
      setStoredNickname(result.nickname);
      await queryClient.invalidateQueries({ queryKey: memberKeys.me });
      navigate({ to: "/mypage" });
    },
    onError: (error) => {
      alert(getErrorMessage(error, "정보 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });

  // 닉네임을 바꿨다면 중복 확인을 통과해야 저장 가능
  const canSave =
    isChanged && isNicknameValid && isNicknameChecked && !isSaving && !isChecking;

  const handleChangeNickname = (value: string) => {
    if (isChecking) return;
    setNickname(value);
    setIsNicknameChecked(false);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || !isChanged || isChecking) return;
    setIsChecking(true);
    try {
      const { available } = await checkNicknameDuplicate(trimmed);
      setIsNicknameChecked(available);
      alert(
        available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setIsNicknameChecked(false);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1126px] flex-1 flex-col px-6 py-6 pb-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-app-text-h">
            내 정보 수정
          </h1>
          <p className="mt-1 text-xs text-app-text">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          disabled={!canSave}
          onClick={() => save({ nickname: trimmed })}
          className="h-9 rounded-lg border-none bg-app-accent px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "저장 중" : "변경사항 저장"}
        </button>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="flex flex-col items-center pt-4">
          <div className="relative">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-app-surface">
              <img className="h-9 w-9" src="/icons/person.svg" alt="" />
            </div>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              className="absolute right-0 bottom-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-none bg-white p-0"
            >
              <img className="h-[22px] w-[22px]" src="/icons/edit.svg" alt="" />
            </button>
          </div>
          <p className="mt-2 text-[13px] font-bold text-app-text-h">
            프로필 이미지
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            선택 사항 · 최대 5MB
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-app-text-h">닉네임</span>
            <div className="relative">
              <input
                type="text"
                className={`${inputClass} pr-20`}
                value={nickname}
                disabled={isChecking}
                onChange={(e) => handleChangeNickname(e.target.value)}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={!isNicknameValid || !isChanged || isChecking}
                className="absolute top-1/2 right-3 -translate-y-1/2 border-none bg-transparent text-xs font-bold text-app-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isNicknameChecked ? "확인 완료" : "중복 확인"}
              </button>
            </div>
            {!isNicknameValid && (
              <span className="text-xs text-red-500">
                닉네임은 2–12자로 입력해 주세요
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold text-app-text-h">이메일</span>
            <input
              type="email"
              className={inputClass}
              value={me.email}
              readOnly
            />
          </label>
        </div>
      </div>

      <section className="mt-auto flex items-center justify-between rounded-lg border border-red-500 bg-red-50 px-5 py-4">
        <div>
          <h2 className="text-[13px] font-bold text-red-600">회원 탈퇴</h2>
          <p className="mt-1 text-[11px] text-red-600">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className="h-9 flex-shrink-0 rounded-lg border border-red-500 bg-white px-4 text-sm font-bold text-red-600"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}

export function MyPageEdit() {
  const isLoggedIn = useAuthStore((state) => state.accessToken !== null);
  const { data: me, isPending, isError } = useQuery(meQueryOptions(isLoggedIn));

  if (!isLoggedIn || isError) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8">
        <p role="alert" className="text-sm text-app-text">
          {isLoggedIn
            ? "내 정보를 불러오지 못했어요. 다시 로그인해 주세요."
            : "로그인이 필요해요."}{" "}
          <Link to="/login" className="font-bold text-app-accent no-underline">
            로그인
          </Link>
        </p>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-[1126px] flex-1 px-6 py-8">
        <p role="status" className="text-sm text-app-text">
          내 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  return <MyPageEditForm me={me} />;
}
