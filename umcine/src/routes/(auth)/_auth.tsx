import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(auth)/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}