import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../screens/members/my-page";

export const Route = createFileRoute("/(authenticated)/_auth/my")({
  component: MyPage,
});