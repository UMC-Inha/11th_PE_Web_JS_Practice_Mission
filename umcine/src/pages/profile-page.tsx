import { useRef, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import type { MemberInfo } from '../api/members/me';
import { useMeQuery } from '../hooks/use-me-query';
import { useUpdateMeMutation } from '../hooks/use-update-me-mutation';
import { useAuthStore } from '../stores/auth-store';
import { useProfileStore } from '../stores/profile-store';
import { MemberRatings } from '../components/member-ratings';
import { FavoriteMovies } from '../components/movies/favorite-movies';

export function ProfilePage({ editing = false }: { editing?: boolean }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  if (accessToken && meQuery.data) {
    return (
      <ProfileContent
        key={meQuery.data.email}
        profile={meQuery.data}
        editing={editing}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-320 flex-1 px-5 pt-7">
      <h1 className="text-3xl font-extrabold">내 정보</h1>
      {!accessToken ? (
        <Link
          to="/login"
          className="mt-4 inline-block font-semibold text-blue-600"
        >
          로그인하고 내 정보 보기
        </Link>
      ) : meQuery.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-600">
          내 정보를 불러오지 못했어요.
        </p>
      ) : (
        <p role="status" className="mt-4 text-sm">
          내 정보를 불러오는 중이에요.
        </p>
      )}
    </main>
  );
}

function ProfileContent({
  profile,
  editing,
}: {
  profile: MemberInfo;
  editing: boolean;
}) {
  const image = useProfileStore((state) => state.images[profile.email] ?? '');
  const setImage = useProfileStore((state) => state.setImage);
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();
  const [nickname, setNickname] = useState(profile.nickname);
  const [preview, setPreview] = useState(image);
  const [imageError, setImageError] = useState('');
  const [isReadingImage, setIsReadingImage] = useState(false);
  const selection = useRef(0);
  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  function saveProfile(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !editing ||
      !isNicknameValid ||
      isReadingImage ||
      updateMeMutation.isPending
    )
      return;

    updateMeMutation.mutate(
      { nickname: nickname.trim() },
      {
        onSuccess: () => {
          if (!useAuthStore.getState().accessToken) return;
          setImage(profile.email, preview);
          void navigate({ to: '/profile' });
        },
      },
    );
  }
  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const version = ++selection.current;
    setImageError('');
    setIsReadingImage(false);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('JPG, PNG, WebP 이미지를 선택해 주세요.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('5MB 이하의 이미지를 선택해 주세요.');
      return;
    }
    setIsReadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      if (version !== selection.current) return;
      try {
        const dataUrl = reader.result;
        if (typeof dataUrl !== 'string') throw new Error('Missing image data');
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        if (version === selection.current) setPreview(dataUrl);
      } catch {
        if (version === selection.current) {
          setImageError(
            '표시할 수 없는 이미지예요. 다른 파일을 선택해 주세요.',
          );
        }
      } finally {
        if (version === selection.current) setIsReadingImage(false);
      }
    };
    reader.onerror = () => {
      if (version !== selection.current) return;
      setImageError('이미지를 읽을 수 없어요.');
      setIsReadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-91px)] w-[calc(100%-40px)] max-w-320 flex-1 flex-col pb-6 pt-7 md:w-[calc(100%-80px)] lg:w-[calc(100%-160px)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
            {editing ? '내 정보 수정' : '내 정보'}
          </h1>
          <p className="mt-2 text-sm text-[#818898]">
            {editing
              ? '닉네임과 프로필 이미지만 변경할 수 있어요.'
              : '내 프로필 정보를 확인해 보세요.'}
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Link
              to="/profile"
              className="mt-3 rounded-lg border border-[#e2e5eb] bg-white px-4 py-3 text-sm"
            >
              취소
            </Link>
            <button
              type="submit"
              form="profile-edit-form"
              disabled={
                !isNicknameValid || isReadingImage || updateMeMutation.isPending
              }
              className="mt-3 rounded-lg bg-[#2864fa] px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
            >
              {isReadingImage
                ? '이미지 확인 중'
                : updateMeMutation.isPending
                  ? '저장 중'
                  : '변경사항 저장'}
            </button>
          </div>
        ) : (
          <Link
            to="/profile/edit"
            className="mt-3 rounded-lg bg-[#2864fa] px-4 py-3 text-sm font-bold text-white"
          >
            내 정보 수정
          </Link>
        )}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
        <div className="flex flex-col items-center pt-5">
          <label
            className="group relative cursor-pointer rounded-full"
            title="프로필 이미지 선택"
          >
            <span className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
              <img
                src={(editing ? preview : image) || '/movie-icons/person.svg'}
                alt="프로필 이미지"
                className={
                  (editing ? preview : image)
                    ? 'h-full w-full object-cover'
                    : 'h-10 w-10'
                }
              />
            </span>
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#181a20] bg-[#f6f7f9]">
              <img src="/movie-icons/edit.svg" alt="" className="h-4 w-4" />
            </span>
            <input
              disabled={!editing || updateMeMutation.isPending}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="프로필 이미지 선택"
              onChange={chooseImage}
              className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0"
            />
          </label>
          <p className="mt-2 text-sm font-bold">프로필 이미지</p>
          <p className="mt-1 text-xs text-[#a0a7b4]">선택 사항 · 최대 5MB</p>
          {imageError && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {imageError}
            </p>
          )}
        </div>
        <form
          id="profile-edit-form"
          onSubmit={saveProfile}
          className="space-y-5"
        >
          <label className="block text-sm font-bold" htmlFor="profile-nickname">
            닉네임
          </label>
          <input
            id="profile-nickname"
            readOnly={!editing || updateMeMutation.isPending}
            value={editing ? nickname : profile.nickname}
            onChange={(event) => setNickname(event.target.value)}
            aria-invalid={editing && !isNicknameValid}
            aria-describedby={
              editing && !isNicknameValid ? 'nickname-error' : undefined
            }
            className="h-13 w-full rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm focus:outline-blue-600"
          />
          {editing && !isNicknameValid && (
            <p
              id="nickname-error"
              role="alert"
              className="text-xs text-red-600"
            >
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}
          <label className="block text-sm font-bold" htmlFor="profile-email">
            이메일
          </label>
          <input
            id="profile-email"
            type="email"
            readOnly
            value={profile.email}
            className="h-13 w-full rounded-lg border border-[#e2e5eb] bg-white px-4 text-sm text-[#677080]"
          />
        </form>
      </div>

      {!editing && <FavoriteMovies />}

      <div className="mt-auto pt-16">
        <details className="mb-5 text-sm text-[#677080]">
          <summary className="w-fit cursor-pointer rounded py-2 font-medium">
            회원별 영화 평점 조회
          </summary>
          <MemberRatings />
        </details>
        <section
          aria-labelledby="withdraw-heading"
          className="flex flex-col justify-between gap-4 rounded-xl border border-[#ff5b55] bg-[#fae9e9] p-5 sm:flex-row sm:items-center"
        >
          <div>
            <h2
              id="withdraw-heading"
              className="text-sm font-bold text-[#ec514a]"
            >
              회원 탈퇴
            </h2>
            <p className="mt-1 text-xs text-[#ec514a]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
              없습니다.
            </p>
          </div>
          <button
            type="button"
            disabled
            title="회원 탈퇴 기능은 아직 준비 중입니다."
            className="shrink-0 self-start rounded-lg border border-[#ff5b55] bg-white px-4 py-3 text-sm font-bold text-[#ec514a] sm:self-auto"
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </main>
  );
}
