import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  checkNicknameAvailability,
  MemberApiError,
  myInfoQueryKey,
  updateMyInfo,
} from "../../api/auth-member";
import type { MemberInfo } from "../../api/auth-member";
import { MemberProfile } from "../../components/members/member-profile";
import { useAuthStore } from "../../stores/auth-store";
import type { AuthSession } from "../../stores/auth-store";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function MyPageEdit() {
  return (
    <MemberProfile>
      {(profile, session) => (
        <ProfileEditForm
          key={session.id}
          profile={profile}
          session={session}
        />
      )}
    </MemberProfile>
  );
}

function ProfileEditForm({
  profile,
  session,
}: {
  profile: MemberInfo;
  session: AuthSession;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState(
    profile.nickname,
  );

  const [profileImage, setProfileImage] = useState<
    string | null
  >(null);

  const [checkedNickname, setCheckedNickname] =
    useState("");

  const [checkMessage, setCheckMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] =
    useState(false);

  const readerRef = useRef<FileReader | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: (nextNickname: string) =>
      updateMyInfo(session, nextNickname),

    onSuccess: async (savedProfile) => {
      if (
        useAuthStore.getState().session?.id !==
        session.id
      ) {
        return;
      }

      await queryClient.cancelQueries({
        queryKey: myInfoQueryKey(session.id),
      });

      queryClient.setQueryData(
        myInfoQueryKey(session.id),
        savedProfile,
      );

      await navigate({
        to: "/mypage",
      });
    },

    onError: (error) => {
      if (
        error instanceof MemberApiError &&
        error.status === 409
      ) {
        setCheckedNickname("");
        setCheckMessage("");
      }
    },
  });

  const trimmedNickname = nickname.trim();

  const isNicknameValid =
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 12;

  const isChecked =
    trimmedNickname === profile.nickname ||
    checkedNickname === trimmedNickname;

  const canSave =
    isNicknameValid &&
    isChecked &&
    !isReadingImage &&
    !imageError &&
    !isChecking &&
    !mutation.isPending;

  const handleCheckNickname = async () => {
    if (
      !isNicknameValid ||
      isChecking ||
      mutation.isPending
    ) {
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
      const response =
        await checkNicknameAvailability(
          trimmedNickname,
        );

      if (typeof response.available !== "boolean") {
        throw new Error(
          "중복 확인 응답을 확인할 수 없어요.",
        );
      }

      setCheckedNickname(
        response.available ? trimmedNickname : "",
      );

      setCheckMessage(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch (error) {
      setCheckMessage(
        error instanceof Error
          ? error.message
          : "중복 확인에 실패했어요.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(
    () => () => readerRef.current?.abort(),
    [],
  );

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    readerRef.current?.abort();
    setIsReadingImage(false);

    if (!IMAGE_TYPES.includes(file.type)) {
      setImageError(
        "JPG, PNG, WEBP 이미지를 선택해 주세요.",
      );
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        "프로필 이미지는 최대 5MB까지 선택할 수 있어요.",
      );
      return;
    }

    setImageError("");
    setIsReadingImage(true);

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }

      setIsReadingImage(false);
    };

    reader.onerror = () => {
      setImageError(
        "이미지를 읽지 못했어요. 다시 선택해 주세요.",
      );
      setIsReadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <main className="flex min-h-[calc(100svh-91px)] w-full flex-1 flex-col px-5 pt-6 pb-7 xl:px-20">
      <form
        className="flex flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();

          if (!canSave) {
            return;
          }

          mutation.mutate(trimmedNickname);
        }}
      >
        <div className="flex min-h-[69px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] leading-[41px] font-bold">
              내 정보 수정
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#667085]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSave}
            className="flex h-[42px] w-[108px] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#2563EB] text-[13px]! font-bold! whitespace-nowrap text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending
              ? "저장 중…"
              : "변경사항 저장"}
          </button>
        </div>

        {mutation.error && (
          <p
            role="alert"
            className="mt-4 text-sm text-red-600"
          >
            {mutation.error.message}
          </p>
        )}

        <div className="mt-8 grid items-center gap-y-8 md:min-h-[164px] md:grid-cols-2 md:gap-y-0">
          <div className="flex min-h-[133px] flex-col items-center justify-center py-1.5">
            <div className="relative size-[82px]">
              <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-[#E3E6EA]">
                <img
                  src={
                    profileImage ?? "/icons/person.svg"
                  }
                  alt="프로필 이미지 미리보기"
                  className={
                    profileImage
                      ? "size-full object-cover"
                      : "size-12"
                  }
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={mutation.isPending}
                aria-label="프로필 이미지 변경"
                className="absolute right-0 bottom-0 size-6 cursor-pointer rounded-full bg-[#F6F7F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <img
                  src="/icons/edit.svg"
                  alt=""
                  className="size-6"
                />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="프로필 이미지 파일"
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="text-sm leading-[21px] font-semibold">
              프로필 이미지
            </p>

            <p className="text-[11px] leading-[18px] text-[#98A2B3]">
              선택 사항 · 최대 5MB
            </p>

            {isReadingImage && (
              <p
                role="status"
                className="mt-2 text-xs text-[#667085]"
              >
                이미지를 불러오는 중이에요.
              </p>
            )}

            {imageError && (
              <p
                role="alert"
                className="mt-2 text-xs text-[#F04438]"
              >
                {imageError}
              </p>
            )}
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
                    mutation.reset();
                  }}
                  disabled={
                    isChecking || mutation.isPending
                  }
                  aria-invalid={!isNicknameValid}
                  aria-describedby={
                    !isNicknameValid
                      ? "nickname-error"
                      : undefined
                  }
                  className="h-full min-w-0 flex-1 bg-transparent px-[15px] text-sm! outline-none"
                />

                <button
                  type="button"
                  disabled={
                    !isNicknameValid ||
                    isChecking ||
                    mutation.isPending
                  }
                  onClick={() =>
                    void handleCheckNickname()
                  }
                  className="h-full shrink-0 cursor-pointer px-[15px] text-xs! font-bold! text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isChecking
                    ? "확인 중…"
                    : "중복 확인"}
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
                    isChecked
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {checkMessage}
                </p>
              )}

              {isNicknameValid &&
                !isChecked &&
                !checkMessage && (
                  <p className="mt-2 text-xs text-gray-500">
                    새 닉네임의 중복 여부를 확인해
                    주세요.
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
                탈퇴하면 작성한 평점, 후기와 즐겨찾기가
                모두 삭제되며 복구할 수 없습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alert("회원 탈퇴 기능은 준비 중이에요.")
              }
              className="h-[42px] shrink-0 cursor-pointer rounded-lg border border-[#FF3B30] bg-white px-4 text-[13px]! font-bold!"
            >
              회원 탈퇴
            </button>
          </section>
        </div>
      </form>
    </main>
  );
}