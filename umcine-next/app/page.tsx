import type { Metadata } from "next";
import { MovieList } from "@/app/components/movies/movie-list";

export const metadata: Metadata = {
  // 루트 layout의 title.template은 같은 세그먼트의 page에는 적용되지 않아 absolute로 직접 지정한다.
  title: { absolute: "영화 | UMCine" },
  description: "지금 볼 만한 영화를 UMCine에서 찾아보세요.",
};

export default function HomePage() {
  return <MovieList />;
}
