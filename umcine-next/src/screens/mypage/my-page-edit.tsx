"use client";

import Image from "next/image";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { HTTPError } from "ky";
import { checkNicknameAvailability } from "../../api/auth-member";
import type { MemberInfo } from "../../api/members/me";
import { MemberProfile } from "../../components/members/member-profile";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPageEdit() {
  return (
    <MemberProfile>
      {(profile, accessToken) => (
        <ProfileEditForm key={accessToken} profile={profile} />
      )}
    </MemberProfile>
  );
}

function ProfileEditForm({ profile }: { profile: MemberInfo }) {
  const router = useRouter();
  const updateMeMutation = useUpdateMeMutation();

  const [nickname, setNickname] = useState(profile.nickname);
  const [checkedNickname, setCheckedNickname] = useState("");
  const [checkMessage, setCheckMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const trimmedNickname = nickname.trim();

  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  const isChecked =
    trimmedNickname === profile.nickname || checkedNickname === trimmedNickname;

  const canSubmit = isNicknameValid && isChecked && !isChecking;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          router.push("/mypage");
        },
        onError: (error) => {
          if (error instanceof HTTPError && error.response.status === 409) {
            setCheckedNickname("");
            setCheckMessage("이미 사용 중인 닉네임이에요.");
          }
        },
      },
    );
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || isChecking || updateMeMutation.isPending) {
      return;
    }

    if (trimmedNickname === profile.nickname) {
      setCheckMessage("현재 사용 중인 닉네임이에요.");
      return;
    }

    setIsChecking(true);
    setCheckedNickname("");
    setCheckMessage("");

    try {
      const response = await checkNicknameAvailability(trimmedNickname);

      if (typeof response.available !== "boolean") {
        throw new Error("중복 확인 응답을 확인할 수 없어요.");
      }

      setCheckedNickname(response.available ? trimmedNickname : "");

      setCheckMessage(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch (error) {
      setCheckMessage(
        error instanceof Error ? error.message : "중복 확인에 실패했어요.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100svh-91px)] w-full flex-1 flex-col px-5 pt-6 pb-7 xl:px-20">
      <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
        <div className="flex min-h-[69px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] leading-[41px] font-bold">
              내 정보 수정
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#667085]">
              닉네임만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="flex h-[42px] w-[108px] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#2563EB] text-[13px]! font-bold! whitespace-nowrap text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMeMutation.isPending ? "저장 중…" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-8 grid items-center gap-y-8 md:min-h-[164px] md:grid-cols-2 md:gap-y-0">
          <div className="flex min-h-[133px] flex-col items-center justify-center py-1.5">
            <div className="flex size-[82px] items-center justify-center overflow-hidden rounded-full bg-[#E3E6EA]">
              <Image
                src="/icons/person.svg"
                width={48}
                height={48}
                alt="프로필 이미지"
                className="size-12"
              />
            </div>

            <p className="text-sm leading-[21px] font-semibold">
              프로필 이미지
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-[18px]">
            <div>
              <label
                htmlFor="profile-nickname"
                className="mb-2 block text-[13px] leading-4 font-semibold"
              >
                닉네임
              </label>

              <div className="flex h-[49px] items-center overflow-hidden rounded-lg border border-[#E0E4EA] bg-white focus-within:border-blue-600">
                <input
                  id="profile-nickname"
                  name="nickname"
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setCheckedNickname("");
                    setCheckMessage("");
                    updateMeMutation.reset();
                  }}
                  disabled={isChecking || updateMeMutation.isPending}
                  aria-invalid={!isNicknameValid}
                  aria-describedby={
                    !isNicknameValid ? "nickname-error" : undefined
                  }
                  className="h-full min-w-0 flex-1 bg-transparent px-[15px] text-sm! outline-none"
                />

                <button
                  type="button"
                  disabled={
                    !isNicknameValid || isChecking || updateMeMutation.isPending
                  }
                  onClick={() => void handleCheckNickname()}
                  className="h-full shrink-0 cursor-pointer px-[15px] text-xs! font-bold! text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChecking ? "확인 중…" : "중복 확인"}
                </button>
              </div>

              {!isNicknameValid && (
                <p
                  id="nickname-error"
                  role="alert"
                  className="mt-2 text-xs text-[#F04438]"
                >
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}

              {checkMessage && (
                <p
                  role="status"
                  className={`mt-2 text-xs ${
                    isChecked ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {checkMessage}
                </p>
              )}

              {isNicknameValid && !isChecked && !checkMessage && (
                <p className="mt-2 text-xs text-gray-500">
                  새 닉네임의 중복 여부를 확인해 주세요.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-[13px] leading-4 font-semibold"
              >
                이메일
              </label>

              <input
                id="profile-email"
                name="email"
                type="email"
                value={profile.email}
                readOnly
                className="h-[49px] w-full rounded-lg border border-[#E0E4EA] bg-white px-[15px] text-sm! outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="mt-auto pt-8">
        <section
          aria-labelledby="withdrawal-title"
          className="flex min-h-[84px] flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#FF3B30] bg-[#FF3B30]/10 p-5 text-[#FF3B30]"
        >
          <div>
            <h2
              id="withdrawal-title"
              className="text-[13px] leading-4 font-bold"
            >
              회원 탈퇴
            </h2>

            <p className="mt-1 text-[11px] leading-4">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("회원 탈퇴 기능은 준비 중이에요.")}
            className="h-[42px] shrink-0 cursor-pointer rounded-lg border border-[#FF3B30] bg-white px-4 text-[13px]! font-bold!"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
