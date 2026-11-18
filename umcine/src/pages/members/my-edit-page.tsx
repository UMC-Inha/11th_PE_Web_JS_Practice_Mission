import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import {
  getMyInfo,
  MY_INFO_QUERY_KEY,
  type MyInfo,
} from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

export function MyEditPage() {
  const myInfoQuery = useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: getMyInfo,
  });

  if (myInfoQuery.isPending || myInfoQuery.isError) {
    return (
      <main className="mx-auto flex min-h-[933px] max-w-[1440px] items-center justify-center px-20 py-6 text-sm text-[#606774]">
        {myInfoQuery.isPending
          ? "내 정보를 불러오는 중이에요."
          : "내 정보를 불러오지 못했어요."}
      </main>
    );
  }

  // 불러온 값으로 입력 칸을 채우려고 폼을 따로 렌더링
  return <MyEditForm myInfo={myInfoQuery.data} />;
}

function MyEditForm({ myInfo }: { myInfo: MyInfo }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(myInfo.nickname);
  const [duplicateCheck, setDuplicateCheck] = useState(
    DEFAULT_DUPLICATE_CHECK,
  );
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미리보기 URL은 바뀌거나 페이지를 떠날 때 해제
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== myInfo.nickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 수정 API는 닉네임만 받으므로 닉네임을 바꾸고 중복 확인을 통과해야 저장 가능
  const canSave =
    isNicknameChanged && isNicknameValid && duplicateCheck.isAvailable;

  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: (updatedInfo) => {
      // 응답으로 받은 내 정보로 캐시를 바로 갱신
      queryClient.setQueryData(MY_INFO_QUERY_KEY, updatedInfo);
      alert("내 정보를 수정했어요.");
      navigate({ to: "/me" });
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const handleChangeNickname = (value: string) => {
    if (duplicateCheck.isChecking) return;
    setDuplicateCheck(DEFAULT_DUPLICATE_CHECK);
    setNickname(value);
  };

  const handleCheckDuplicate = async () => {
    if (duplicateCheck.isChecking) return;
    if (!isNicknameValid) {
      alert("닉네임은 2–12자로 입력해 주세요.");
      return;
    }
    if (!isNicknameChanged) {
      alert("현재 사용 중인 닉네임이에요.");
      return;
    }

    setDuplicateCheck({ isChecking: true, isAvailable: false });
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setDuplicateCheck({ isChecking: false, isAvailable: response.available });
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setDuplicateCheck(DEFAULT_DUPLICATE_CHECK);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 change가 일어나도록 비움
    e.target.value = "";
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 올릴 수 있어요.");
      return;
    }
    // 수정 API가 이미지를 받지 않아 지금은 미리보기만 보여줌
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (updateMutation.isPending) return;
    if (!isNicknameChanged) {
      alert("변경된 내용이 없어요.");
      return;
    }
    if (!canSave) {
      alert("닉네임 중복 확인을 해 주세요.");
      return;
    }

    updateMutation.mutate({ nickname: trimmedNickname });
  };

  const fieldClass =
    "flex min-h-12 w-full items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-[13px] py-[14px]";
  const inputClass =
    "min-w-0 flex-1 px-0.5 py-px text-sm leading-[17px] text-[#17191E] outline-none";
  const labelClass = "text-[13px] font-extrabold leading-4 text-[#17191E]";

  return (
    <main className="mx-auto flex min-h-[933px] max-w-[1440px] flex-col items-start gap-8 px-20 py-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-[9px]">
          <h1 className="text-[31px] leading-[37px] font-bold tracking-[-1.24px] text-[#17191E]">
            내 정보 수정
          </h1>
          <p className="text-sm leading-[22px] text-[#606774]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        {/* 버튼이 form 밖에 있어서 form 속성으로 연결 */}
        <button
          type="submit"
          form="profile-form"
          disabled={updateMutation.isPending}
          className="flex h-[42px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 items-center justify-center rounded-lg border border-white bg-[#2563EB] px-4 text-sm leading-[17px] font-extrabold text-white"
        >
          {updateMutation.isPending ? "저장 중" : "변경사항 저장"}
        </button>
      </div>

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full items-start"
      >
        {/* 프로필 이미지 */}
        <div className="flex flex-1 flex-col items-center gap-1 pt-[15px]">
          <div className="relative mb-1.5">
            <span className="flex size-[82px] items-center justify-center overflow-hidden rounded-full bg-[#E3E6EB]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="프로필 이미지 미리보기"
                  className="size-full object-cover"
                />
              ) : (
                <img src="/icons/person.svg" alt="" className="size-12" />
              )}
            </span>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 -bottom-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white"
            >
              <img src="/icons/edit.svg" alt="" className="size-6" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
          </div>
          <p className="text-[15px] leading-[18px] font-bold text-[#17191E]">
            프로필 이미지
          </p>
          <p className="text-[11px] leading-[13px] text-[#969DA8]">
            선택 사항 · 최대 5MB
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-[17px]">
          {/* 닉네임 */}
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="profile-nickname" className={labelClass}>
              닉네임
            </label>
            <div className={`${fieldClass} focus-within:border-[#2563EB]`}>
              <input
                id="profile-nickname"
                type="text"
                value={nickname}
                onChange={(e) => handleChangeNickname(e.target.value)}
                className={inputClass}
              />
              <button
                id="profile-nickname-check"
                type="button"
                disabled={duplicateCheck.isChecking}
                onClick={handleCheckDuplicate}
                className="shrink-0 cursor-pointer text-xs leading-[14px] font-extrabold text-[#2563EB] disabled:cursor-not-allowed disabled:text-[#969DA8]"
              >
                {duplicateCheck.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="text-[11px] leading-[13px] text-[#DC2626]">
                닉네임은 2–12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 이메일 (변경 불가) */}
          <div className="flex w-full flex-col gap-2 pt-px">
            <label htmlFor="profile-email" className={labelClass}>
              이메일
            </label>
            <div className={fieldClass}>
              <input
                id="profile-email"
                type="email"
                value={myInfo.email}
                readOnly
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </form>

      {/* 회원 탈퇴 */}
      <section className="mt-auto flex w-full items-center justify-between gap-2 rounded-[10px] border border-[#D92D20] bg-[#D92D20]/10 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm leading-[17px] font-bold text-[#D92D20]">
            회원 탈퇴
          </h3>
          <p className="text-[11px] leading-4 text-[#D92D20]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        {/* 회원 탈퇴 확인 창을 만들면 연결하기 */}
        <button
          id="open-delete-dialog"
          type="button"
          className="flex h-[42px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#D92D20] bg-white px-4 text-sm leading-[17px] font-extrabold text-[#D92D20]"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
