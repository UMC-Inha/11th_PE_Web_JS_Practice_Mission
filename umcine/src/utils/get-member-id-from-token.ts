export function getMemberIdFromToken(
  accessToken: string | null,
): number | null {
  if (!accessToken) return null;

  try {
    const payloadPart = accessToken.split(".")[1];

    if (!payloadPart) return null;

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "=",
    );

    const payload = JSON.parse(atob(paddedBase64)) as {
      sub?: unknown;
    };

    if (typeof payload.sub !== "string") return null;

    const memberId = Number(payload.sub);

    return Number.isSafeInteger(memberId) && memberId > 0
      ? memberId
      : null;
  } catch {
    return null;
  }
}