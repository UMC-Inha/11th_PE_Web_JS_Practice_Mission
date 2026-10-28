const baseUrl = (import.meta.env.VITE_MOVIE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(baseUrl + path, { signal: AbortSignal.timeout(10000) });
  } catch {
    throw new Error('서버에 연결할 수 없어요. 서버 실행 상태와 CORS 설정을 확인해 주세요.');
  }
  if (!response.ok) {
    if (response.status === 404) throw new Error('요청한 회원 또는 API를 찾을 수 없어요.');
    throw new Error('요청을 처리하지 못했어요. (HTTP ' + response.status + ')');
  }
  return response.json() as Promise<T>;
}

export const checkNickname = (nickname: string) =>
  get<{ available: boolean }>('/members/nickname/' + encodeURIComponent(nickname));
export const checkEmail = (email: string) =>
  get<{ available: boolean }>('/members/email/' + encodeURIComponent(email));
export const getMemberRatings = (memberId: number) =>
  get<Rating[]>('/members/' + memberId + '/ratings');
