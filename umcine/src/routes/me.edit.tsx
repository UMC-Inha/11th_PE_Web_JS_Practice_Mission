import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/members/profile-edit-page";

export const Route = createFileRoute("/me/edit")({ component: ProfileEditPage });
