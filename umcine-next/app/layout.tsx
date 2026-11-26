import type { Metadata } from "next";
import { Suspense } from "react";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"; // Pretendard 가변 폰트 (적용은 globals.css의 --font-sans)
import "./globals.css";
import { Footer } from "@/app/components/layout/footer";
import { Header } from "@/app/components/layout/header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "영화를 검색하고 평점을 남기는 UMCine",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-svh flex-col">
        <Providers>
          {/* usePathname()은 요청 시점에 정해지는 URL 정보라 Suspense 경계가 필요하다. (cacheComponents) */}
          <Suspense fallback={<div className="h-[61px] border-b border-gray-200 sm:h-[73px]" />}>
            <Header />
          </Suspense>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
