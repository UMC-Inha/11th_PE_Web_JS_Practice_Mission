import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useProfileStore } from '../stores/profile-store';
import { MemberRatings } from '../components/member-ratings';

export function ProfilePage({ editing = false }: { editing?: boolean }) {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  function saveProfile() {
    if (!isNicknameValid) return;
    updateProfile({ ...profile, nickname: nickname.trim(), image: preview });
    void navigate({ to: "/profile" });
  }
  const [preview, setPreview] = useState(profile.image);
  const [imageError, setImageError] = useState('');
  const selection = useRef(0);
  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const version = ++selection.current;
    setImageError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('JPG, PNG, WebP 이미지를 선택해 주세요.'); return;
    }
    if (file.size > 5 * 1024 * 1024) { setImageError('5MB 이하의 이미지를 선택해 주세요.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (version === selection.current) setPreview(String(reader.result)); };
    reader.onerror = () => { if (version === selection.current) setImageError('이미지를 읽을 수 없어요.'); };
    reader.readAsDataURL(file);
  }

  return <main className="mx-auto flex min-h-[calc(100svh-91px)] w-[calc(100%-40px)] max-w-320 flex-1 flex-col pb-6 pt-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">{editing ? "내 정보 수정" : "내 정보"}</h1>
        <p className="mt-2 text-sm text-[#818898]">{editing ? "닉네임과 프로필 이미지만 변경할 수 있어요." : "내 프로필 정보를 확인해 보세요."}</p>
      </div>
      {editing ? (
        <div className="flex gap-2">
          <Link to="/profile" className="mt-3 rounded-lg border border-[#e2e5eb] bg-white px-4 py-3 text-sm">취소</Link>
          <button type="button" onClick={saveProfile} disabled={!isNicknameValid} className="mt-3 rounded-lg bg-[#2864fa] px-4 py-3 text-sm font-bold text-white disabled:opacity-40">변경사항 저장</button>
        </div>
      ) : <Link to="/profile/edit" className="mt-3 rounded-lg bg-[#2864fa] px-4 py-3 text-sm font-bold text-white">내 정보 수정</Link>}
    </div>

    <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
      <div className="flex flex-col items-center pt-5">
        <label className="group relative cursor-pointer rounded-full" title="프로필 이미지 선택">
          <span className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
            <img src={(editing ? preview : profile.image) || '/movie-icons/person.svg'} alt="프로필 이미지" className={(editing ? preview : profile.image) ? 'h-full w-full object-cover' : 'h-10 w-10'} />
          </span>
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#181a20] bg-[#f6f7f9]">
            <img src="/movie-icons/edit.svg" alt="" className="h-4 w-4" />
          </span>
          <input disabled={!editing} type="file" accept="image/jpeg,image/png,image/webp" aria-label="프로필 이미지 선택" onChange={chooseImage}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0" />
        </label>
        <p className="mt-2 text-sm font-bold">프로필 이미지</p>
        <p className="mt-1 text-xs text-[#a0a7b4]">선택 사항 · 최대 5MB</p>
        <p className="mt-2 text-xs text-[#818898]">실습용 프로필 · 변경 사항은 새로고침 전까지 유지돼요.</p>
        {imageError && <p role="alert" className="mt-2 text-xs text-red-600">{imageError}</p>}
      </div>
      <div className="space-y-5">
        <label className="block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
        <input id="profile-nickname" readOnly={!editing} value={editing ? nickname : profile.nickname}
          onChange={(event) => setNickname(event.target.value)}
          aria-invalid={editing && !isNicknameValid} aria-describedby={editing && !isNicknameValid ? "nickname-error" : undefined}
          className="h-13 w-full rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm focus:outline-blue-600" />
        {editing && !isNicknameValid && <p id="nickname-error" role="alert" className="text-xs text-red-600">닉네임은 2~12자로 입력해 주세요.</p>}
        <label className="block text-sm font-bold" htmlFor="profile-email">이메일</label>
        <input id="profile-email" type="email" readOnly value={profile.email}
          className="h-13 w-full rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm text-[#677080]" />
      </div>
    </div>

    <div className="mt-auto pt-16">
      <details className="mb-5 text-sm text-[#677080]">
        <summary className="w-fit cursor-pointer rounded py-2 font-medium">회원별 영화 평점 조회</summary>
        <MemberRatings />
      </details>
      <section aria-labelledby="withdraw-heading" className="flex flex-col justify-between gap-4 rounded-xl border border-[#ff5b55] bg-[#fae9e9] p-5 sm:flex-row sm:items-center">
        <div>
          <h2 id="withdraw-heading" className="text-sm font-bold text-[#ec514a]">회원 탈퇴</h2>
          <p className="mt-1 text-xs text-[#ec514a]">탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
        </div>
        <button type="button" disabled title="회원 탈퇴 기능은 아직 준비 중입니다."
          className="shrink-0 self-start rounded-lg border border-[#ff5b55] bg-white px-4 py-3 text-sm font-bold text-[#ec514a] sm:self-auto">회원 탈퇴</button>
      </section>
    </div>
  </main>;
}
