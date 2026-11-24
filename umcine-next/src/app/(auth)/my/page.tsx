import { MyPage } from "../../../screens/my/my-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 정보",
};
export default function MyRoute() {
  return <MyPage />;
}