import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#f4f5f7] text-[#111]">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto w-[min(1080px,100%_-_48px)] py-6 text-[#888]">
      페이지를 찾을 수 없어요.
    </main>
  ),
});