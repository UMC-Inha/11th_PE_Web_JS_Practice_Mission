import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "../components/auth/require-auth";

export const Route = createFileRoute("/me")({
  component: () => <RequireAuth><Outlet /></RequireAuth>,
});
