import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../../screens/members/my-edit-page";

export const Route = createFileRoute("/(authenticated)/_auth/my-edit")({
  component: MyEditPage,
});