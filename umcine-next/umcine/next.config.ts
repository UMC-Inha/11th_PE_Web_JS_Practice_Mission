import type { NextConfig } from "next";

// nextjs-example 프로젝트 설정을 그대로 가져옴
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // 영화 포스터/배경 이미지는 TMDB 이미지 서버에서 가져옴
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
};

export default nextConfig;
