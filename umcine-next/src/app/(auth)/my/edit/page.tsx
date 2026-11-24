import { MyEditPage } from "../../../../screens/my/my-edit-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 정보 수정",
};
export default function MyEditRoute() {
  return <MyEditPage />;
}