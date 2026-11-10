import { createFileRoute } from "@tanstack/react-router";
import { EditPage } from "../pages/mypage/edit-page";

export const Route = createFileRoute("/mypage_/edit")({
  component: EditPage,
});