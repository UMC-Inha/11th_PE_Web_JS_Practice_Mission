import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";
import { Footer } from "../components/layout/footer";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
  notFoundComponent: () => <main className="mx-auto w-full max-w-320 flex-1 px-5 py-12">페이지를 찾을 수 없어요.</main>,
});
