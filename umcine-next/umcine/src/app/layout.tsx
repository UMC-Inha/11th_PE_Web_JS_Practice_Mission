import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

// Server Component: index.html + __root.tsx + main.tsx 역할을 합침
export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
