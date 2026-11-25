export function getAuthMemberId(accessToken: string | null): number | null {
  const payload = accessToken?.split(".")[1];
  if (!payload) return null;

  try {
    // sub selects the ratings URL. The server verifies the token for protected requests.
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof claims.sub !== "string" || !/^\d+$/.test(claims.sub)) return null;

    const memberId = Number(claims.sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
