import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);
  return token ? children : <Navigate to="/login" replace />;
}
