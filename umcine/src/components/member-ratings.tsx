import { useState } from 'react';
import type { FormEvent } from 'react';
import { getMemberRatings } from '../api/members';
import type { Rating } from '../api/members';
const inputClass = 'min-w-0 flex-1 rounded-lg border border-[#e2e5eb] bg-white px-4 py-3 text-sm';
const buttonClass = 'rounded-lg bg-[#2864fa] px-5 py-3 text-sm font-bold text-white disabled:opacity-50';
const cardClass = 'rounded-xl border border-[#e2e5eb] bg-white p-5';
export function MemberRatings() {
  const [memberId, setMemberId] = useState('1');
  const [ratings, setRatings] = useState<Rating[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setRatings(null);
    setError('');
    const id = Number(memberId);
    if (!Number.isSafeInteger(id) || id < 1) { setError('회원 ID는 양의 정수로 입력해 주세요.'); return; }
    setPending(true);
    try { setRatings(await getMemberRatings(id)); }
    catch (error) { setError(error instanceof Error ? error.message : '평점 조회에 실패했어요.'); }
    finally { setPending(false); }
  }


return (    <section className={cardClass + ' mt-6'}>
      <h2 className="text-xl font-bold">회원별 영화 평점</h2>
      <p className="mb-5 mt-2 text-sm text-[#677080]">회원 ID로 등록된 평점을 최신순으로 조회합니다.</p>
      <form onSubmit={submit}>
        <label htmlFor="member-id" className="mb-2 block text-sm font-semibold">회원 ID</label>
        <div className="flex gap-2">
          <input id="member-id" type="number" min="1" step="1" required value={memberId} disabled={pending}
            className={inputClass} onChange={event => { setMemberId(event.target.value); setRatings(null); setError(''); }} />
          <button className={buttonClass} disabled={pending}>{pending ? '조회 중…' : '평점 조회'}</button>
        </div>
      </form>
      <div aria-live="polite" className="mt-6">
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {ratings && <p className="mb-4 text-sm text-[#677080]">총 {ratings.length}개의 평점</p>}
        {ratings?.length === 0 && <p className="rounded-xl bg-[#f6f7f9] p-6 text-center text-sm">아직 등록한 평점이 없어요.</p>}
        {ratings && <ul className="space-y-3">{ratings.map(rating => <li key={rating.ratingId} className="rounded-xl border border-[#e2e5eb] p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold">영화 #{rating.movieId}</h3>
            <span className="font-bold text-[#2864fa]">★ {rating.score} / 5</span>
          </div>
          <p className="my-3 whitespace-pre-wrap break-words text-sm">{rating.comment || '작성한 코멘트가 없어요.'}</p>
          <p className="text-xs text-[#677080]">평점 #{rating.ratingId} · {new Date(rating.createdAt).toLocaleString('ko-KR')}</p>
        </li>)}</ul>}
      </div>
    </section>
);
}
