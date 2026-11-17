import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "../../../components/auth/require-auth";

export const Route = createFileRoute("/(protected)/me")({
  component: () => <RequireAuth><Outlet /></RequireAuth>,
});
