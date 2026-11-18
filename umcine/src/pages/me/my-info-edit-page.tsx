import { useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { ProfileAvatar } from "../../components/me/profile-avatar";
import { useProfileStore } from "../../stores/profile-store";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function MyInfoEditPage() {
  const navigate = useNavigate();
  const {
    nickname: savedNickname,
    email,
    profileImage: savedProfileImage,
    updateProfile,
  } = useProfileStore();

  const [nickname, setNickname] = useState(savedNickname);
  const [profileImage, setProfileImage] = useState(savedProfileImage);
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    isAvailable: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== savedNickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const canSave =
    isNicknameValid && (!isNicknameChanged || duplicateCheck.isAvailable);

  const handleNicknameChange = (value: string) => {
    if (duplicateCheck.isChecking) return;
    setDuplicateCheck({ isChecking: false, isAvailable: false });
    setNickname(value);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || !isNicknameChanged || duplicateCheck.isChecking) {
      return;
    }

    setDuplicateCheck({ isChecking: true, isAvailable: false });

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setDuplicateCheck({ isChecking: true, isAvailable: response.available });
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, isChecking: false }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }

    setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    updateProfile({ nickname: trimmedNickname, profileImage });
    navigate({ to: "/me" });
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-100 p-4 text-left sm:p-8">
      <form className="mb-12" onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">내 정보 수정</h1>
            <p className="mt-1 text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-default disabled:bg-gray-400"
          >
            변경사항 저장
          </button>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col items-center gap-1 pt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer rounded-full border-0 bg-transparent p-0"
            >
              <ProfileAvatar imageUrl={profileImage} />
              <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border-2 border-gray-900 bg-white">
                <img src="/icons/edit.svg" alt="" className="size-3.5" />
              </span>
            </button>
            <p className="m-0 mt-2 text-[15px] font-bold text-gray-900">
              프로필 이미지
            </p>
            <p className="m-0 text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-nickname" className="text-sm font-bold text-gray-900">
                닉네임
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
                <input
                  id="edit-nickname"
                  type="text"
                  placeholder="2~12자"
                  value={nickname}
                  disabled={duplicateCheck.isChecking}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  disabled={
                    !isNicknameValid ||
                    !isNicknameChanged ||
                    duplicateCheck.isChecking
                  }
                  onClick={handleCheckDuplicate}
                  className="shrink-0 cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-400"
                >
                  {duplicateCheck.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="text-xs text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-email" className="text-sm font-bold text-gray-900">
                이메일
              </label>
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5">
                <input
                  id="edit-email"
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-transparent text-sm text-gray-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <section className="mt-auto flex items-center justify-between gap-4 rounded-xl border border-red-500 bg-[#f3dede] px-6 py-5">
        <div>
          <h2 className="m-0 text-[15px] font-bold text-red-600">회원 탈퇴</h2>
          <p className="m-0 mt-1 text-xs text-red-600">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-lg border border-red-500 bg-white px-4 py-2.5 text-sm font-semibold text-red-600"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
