import ky from "ky";
import { env } from "../../config/env";

const tmdbClient = ky.create({
  prefix: env.tmdbApiBaseUrl,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
  searchParams: {
    language: "ko-KR",
  },
});

export { tmdbClient };
