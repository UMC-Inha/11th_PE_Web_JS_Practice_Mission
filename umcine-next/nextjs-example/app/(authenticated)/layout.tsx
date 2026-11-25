import { AuthBoundary } from "@/src/components/auth-boundary";
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AuthBoundary>{children}</AuthBoundary>;
}
