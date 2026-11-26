import type { Metadata } from "next";
import { MyInfoEdit } from "@/app/components/me/my-info-edit";

export const metadata: Metadata = {
  title: "내 정보 수정",
  description: "닉네임과 프로필 이미지를 수정하세요.",
};

export default function MyInfoEditPage() {
  return <MyInfoEdit />;
}
