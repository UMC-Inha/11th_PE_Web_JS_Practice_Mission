import type { Metadata } from "next";
import { MyPage } from "@/src/screens/mypage/my-page";

export const metadata: Metadata = { title: "마이페이지" };

export default function Page() {
  return <MyPage />;
}
