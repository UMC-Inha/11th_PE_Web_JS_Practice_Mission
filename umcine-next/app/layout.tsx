import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "영화를 검색하고 평점과 즐겨찾기를 기록하는 UMCine입니다.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMCine",
    description: "좋아하는 영화를 찾고 나만의 영화 기록을 남겨 보세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="mx-auto flex min-h-screen w-full max-w-360 flex-col bg-[#F6F7F9] text-[#191B20]">
            <Suspense fallback={<div className="h-20" />}>
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
