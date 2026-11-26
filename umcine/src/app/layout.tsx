import { Suspense, type ReactNode } from "react";
import { Providers } from "./providers";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import "../index.css";
import "../App.css";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="site-header" />}>
              <Header />
            </Suspense>

            <div className="flex flex-1 flex-col">
              {children}
            </div>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}