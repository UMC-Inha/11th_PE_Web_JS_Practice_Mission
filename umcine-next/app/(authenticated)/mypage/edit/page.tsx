import type { Metadata } from "next";
import { MyPageEdit } from "@/src/screens/mypage/my-page-edit";

export const metadata: Metadata = { title: "내 정보 수정" };

export default function Page() {
  return <MyPageEdit />;
}
