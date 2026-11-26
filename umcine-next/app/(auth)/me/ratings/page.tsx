import type { Metadata } from "next";
import { MyRatings } from "@/app/components/me/my-ratings";

export const metadata: Metadata = {
  title: "내 평점",
  description: "내가 남긴 영화 평점을 관리하세요.",
};

export default function MyRatingsPage() {
  return <MyRatings />;
}
