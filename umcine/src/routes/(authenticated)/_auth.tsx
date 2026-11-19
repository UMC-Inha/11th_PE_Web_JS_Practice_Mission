import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}