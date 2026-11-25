// JWT payload에서 회원 번호를 꺼냄. 
// 서버가 토큰을 만들 때 memberId를 subject(sub)에 문자열로 담음. (JwtUtil.createAccessToken)
// 서명 검증은 서버가 하므로 여기서는 payload만 읽음.
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;

    const memberId = Number(claims.sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
