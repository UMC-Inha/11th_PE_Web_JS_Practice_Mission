
const memberApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const apiBaseUrl = new URL(memberApiBaseUrl);
if (!["http:", "https:"].includes(apiBaseUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL은 HTTP 또는 HTTPS 주소여야 해요.");
}
apiBaseUrl.pathname = apiBaseUrl.pathname.replace(/\/+$/, "") + "/";
export const env = { apiBaseUrl: apiBaseUrl.href };
