import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../../pages/profile-page";

export const Route = createFileRoute("/(authenticated)/_layout/profile_/edit")({
  component: () => <ProfilePage editing />,
});
