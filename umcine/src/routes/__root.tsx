import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import "../App.css";

export const Route = createRootRoute({
  component: () => (
    <div className="app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),

  notFoundComponent: () => (
    <main className="container movie-page">
      페이지를 찾을 수 없어요.
    </main>
  ),
});