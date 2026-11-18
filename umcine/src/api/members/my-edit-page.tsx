import { useState } from "react";
import {
  LABEL_CLASS,
  INPUT_CLASS,
  CHECK_BUTTON_CLASS,
} from "../../constants/form-style";

// 8주차에서 API로 불러올 값. 지금은 화면 확인용 초기값
const DEFAULT_PROFILE = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function MyEditPage() {
  const [nickname, setNickname] = useState(DEFAULT_PROFILE.nickname);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 선택한 파일을 화면에서 미리 볼 수 있는 임시 주소로 바꾼다
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#F5F6F8] px-20 py-6">
      {/* 제목 영역 — 1280 × 69 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-10 text-[#17191E]">
            내 정보 수정
          </h1>
          <p className="text-sm leading-5 text-[#969DA8]">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="h-10 rounded-lg bg-[#2563EB] px-4 text-sm font-bold text-white transition-opacity hover:brightness-95"
        >
          변경사항 저장
        </button>
      </div>

      {/* 프로필 + 입력 영역  */}
      <div className="mt-7 grid grid-cols-2 gap-x-6">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#E3E6EB] text-[#969DA8]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="프로필 미리보기"
                  className="h-full w-full object-cover"
                />
              ) : (
                <PersonIcon />
              )}
            </div>
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#E3E6EB] bg-white text-[#17191E]"
            >
              <PencilIcon />
              <span className="sr-only">프로필 이미지 변경</span>
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
          </div>
          <p className="text-sm font-bold text-[#17191E]">프로필 이미지</p>
          <p className="-mt-1 text-xs text-[#969DA8]">선택 사항 · 최대 5MB</p>
        </div>

        {/* 닉네임 + 이메일 */}
        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname" className={LABEL_CLASS}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={`${INPUT_CLASS} pl-4 pr-[88px]`}
              />
              <button type="button" className={CHECK_BUTTON_CLASS}>
                중복 확인
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              이메일
            </label>
            {/* 이메일은 변경할 수 없으므로 readOnly */}
            <input
              id="email"
              type="email"
              value={DEFAULT_PROFILE.email}
              readOnly
              className={`${INPUT_CLASS} px-4`}
            />
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <div className="mt-auto flex items-center justify-between rounded-lg border-t border-[#D92D20] bg-[#D92D201A] px-6 py-[22px]">
        <div>
          <p className="text-sm font-bold leading-5 text-[#D92D20]">회원 탈퇴</p>
          <p className="text-xs leading-4 text-[#D92D20]">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          className="h-10 rounded-lg border border-[#D92D20] bg-white px-4 text-sm font-bold text-[#D92D20]"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}