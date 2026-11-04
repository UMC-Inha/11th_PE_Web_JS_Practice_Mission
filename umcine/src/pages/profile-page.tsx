import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { checkEmail, checkNickname } from '../api/members';
import { MemberRatings } from '../components/member-ratings';

function ProfileField({ kind, label, check }: {
  kind: 'nickname' | 'email';
  label: string;
  check: (value: string) => Promise<{ available: boolean }>;
}) {
  const [value, setValue] = useState('');
  const [pending, setPending] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setAvailable(null);
    setError('');
    if (!value.trim()) { setError(label + '을 입력해 주세요.'); return; }
    setPending(true);
    try { setAvailable((await check(value.trim())).available); }
    catch (error) { setError(error instanceof Error ? error.message : '확인에 실패했어요.'); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit}>
    <label htmlFor={kind} className="mb-2 block text-xs font-bold">{label}</label>
    <div className="flex h-13 items-center rounded-lg border border-[#e2e5eb] bg-white focus-within:border-[#2864fa]">
      <input id={kind} value={value} required disabled={pending} type={kind === 'email' ? 'email' : 'text'}
        maxLength={kind === 'email' ? 254 : 50} autoComplete="off"
        placeholder={kind === 'email' ? '이메일을 입력해 주세요' : '닉네임을 입력해 주세요'}
        className="h-full min-w-0 flex-1 rounded-lg bg-transparent px-4 text-sm outline-none! placeholder:text-[#a0a7b4]"
        onChange={event => { setValue(event.target.value); setAvailable(null); setError(''); }} />
      <button disabled={pending} className="h-full shrink-0 rounded-r-lg px-4 text-xs font-bold text-[#2864fa] disabled:opacity-50">
        {pending ? '확인 중…' : '중복 확인'}
      </button>
    </div>
    <div aria-live="polite">
      {available !== null && <p className={'mt-2 text-xs ' + (available ? 'text-green-700' : 'text-red-600')}>
        {available ? '사용 가능한 ' + label + '이에요.' : '이미 사용 중인 ' + label + '이에요.'}
      </p>}
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  </form>;
}

export function ProfilePage() {
  const [preview, setPreview] = useState('');
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
        <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">내 정보 수정</h1>
        <p className="mt-2 text-sm text-[#818898]">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
      </div>
      <button type="button" disabled title="프로필 저장 기능은 아직 준비 중입니다."
        className="mt-3 shrink-0 rounded-lg bg-[#2864fa] px-4 py-3 text-xs font-bold text-white sm:px-5 sm:text-sm">변경사항 저장</button>
    </div>

    <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
      <div className="flex flex-col items-center pt-5">
        <label className="group relative cursor-pointer rounded-full" title="프로필 이미지 선택">
          <span className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full bg-[#e3e6eb]">
            <img src={preview || '/movie-icons/person.svg'} alt="프로필 이미지" className={preview ? 'h-full w-full object-cover' : 'h-10 w-10'} />
          </span>
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#181a20] bg-[#f6f7f9]">
            <img src="/movie-icons/edit.svg" alt="" className="h-4 w-4" />
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="프로필 이미지 선택" onChange={chooseImage}
            className="absolute inset-0 h-full w-full cursor-pointer rounded-full opacity-0" />
        </label>
        <p className="mt-2 text-sm font-bold">프로필 이미지</p>
        <p className="mt-1 text-xs text-[#a0a7b4]">선택 사항 · 최대 5MB</p>
        {preview && <p className="mt-2 text-xs text-[#818898]">미리보기만 적용됩니다.</p>}
        {imageError && <p role="alert" className="mt-2 text-xs text-red-600">{imageError}</p>}
      </div>
      <div className="space-y-5">
        <ProfileField kind="nickname" label="닉네임" check={checkNickname} />
        <ProfileField kind="email" label="이메일" check={checkEmail} />
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
