// 로그인·내 정보 API가 회원 id를 돌려주지 않아서 토큰(JWT)의 sub 값에서 꺼냄
// 서명 검증은 백엔드가 하므로 여기서는 화면에 쓸 id만 읽음
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    // JWT는 base64url 형식이라 atob가 읽을 수 있는 base64로 바꿈
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const memberId = Number(JSON.parse(json).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
