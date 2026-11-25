
import ky from "ky";
// TMDB 인증 토큰은 app/api/tmdb의 서버 코드에서 추가해요.
export const tmdbClient = ky.create({ baseUrl: "/api/tmdb/" });
