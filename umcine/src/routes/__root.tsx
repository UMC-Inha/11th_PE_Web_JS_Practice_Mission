import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] text-[#191b20]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),

  notFoundComponent: () => (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 lg:px-20">
      <h1 className="text-2xl font-bold">
        페이지를 찾을 수 없어요.
      </h1>

      <Link
        to="/"
        className="mt-5 inline-block text-blue-600 underline"
      >
        영화 목록으로
      </Link>
    </main>
  ),
});