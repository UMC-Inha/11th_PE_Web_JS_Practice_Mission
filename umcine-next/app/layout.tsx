import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "./providers";
import { Header } from "../src/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "umcine",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>

      <body>
        <Providers>
          <Suspense fallback={<div className="h-[91px] bg-white" />}>
            <Header />
          </Suspense>

          {children}
        </Providers>
      </body>
    </html>
  );
}