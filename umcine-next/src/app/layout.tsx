import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 찾아보고 평점을 남기는 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f4f5f7] text-[#111]">
            <Suspense
              fallback={
                <div className="h-[76px] border-b border-[#e5e7eb] bg-white" />
              }
            >
              <Header />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}