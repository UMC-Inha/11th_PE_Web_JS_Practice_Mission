import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "../components/layout/header";
import Footer from "../components/layout/footer";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "TMDB 영화 정보를 보고 평점과 북마크를 남기는 영화 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-18 border-b border-gray-200 bg-white" />}>
              <Header />
            </Suspense>
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}