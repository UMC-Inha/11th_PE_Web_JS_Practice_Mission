import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../../pages/mypage/mypage-edit";

export const Route = createFileRoute("/mypage/edit")({
  component: MyPageEdit,
});
