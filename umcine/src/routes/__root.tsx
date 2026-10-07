import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { MovieProvider } from "../contexts/movie-context";

export const Route = createRootRoute({
  component: () => (
    <MovieProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-360 flex-col bg-[#F6F7F9] text-[#191B20]">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </MovieProvider>
  ),

  notFoundComponent: () => (
    <main className="w-full flex-1 px-5 py-12 xl:px-20">
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