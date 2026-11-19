import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "../../pages/me/my-info-edit-page";

export const Route = createFileRoute("/_auth/me/edit")({
  component: MyInfoEditPage,
});
