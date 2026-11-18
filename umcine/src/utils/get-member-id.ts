export function getMemberId(accessToken: string | null): string | null {
    if (!accessToken) return null;
  
    try {
      const payload = accessToken.split(".")[1];
      if (!payload) return null;
  
      const base64 = payload.replaceAll("-", "+").replaceAll("_", "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      const { sub } = JSON.parse(atob(padded)) as { sub?: unknown };
  
      return typeof sub === "string" && /^[1-9]\d*$/.test(sub) ? sub : null;
    } catch {
      return null;
    }
  }