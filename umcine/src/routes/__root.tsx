import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#f4f5f7] text-[#111]">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] py-6 text-[#888]">
      페이지를 찾을 수 없어요.
    </main>
  ),
});