
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  if (!/^(movie\/popular|search\/movie|movie\/[1-9]\d*)$/.test(endpoint)) {
    return NextResponse.json({ message: "지원하지 않는 영화 요청이에요." }, { status: 404 });
  }
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ message: "TMDB 토큰 설정을 확인해 주세요." }, { status: 503 });
  }
  try {
    const baseUrl = process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
    const url = new URL(endpoint, baseUrl.replace(/\/+$/, "") + "/");
    for (const key of ["language", "page", "query", "include_adult"]) {
      const value = request.nextUrl.searchParams.get(key);
      if (value !== null) url.searchParams.set(key, value);
    }
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "영화 서버에 연결하지 못했어요." }, { status: 502 });
  }
}
