
import type { Metadata } from "next";
import Header from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { Providers } from "./providers";
import "./globals.css";
export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 검색, 즐겨찾기와 나만의 평점을 기록하는 UMCine",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers><Header />{children}<Footer /></Providers>
      </body>
    </html>
  );
}
