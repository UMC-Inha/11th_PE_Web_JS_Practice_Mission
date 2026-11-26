import type { Metadata } from "next";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 정보 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f6f7f9] text-[#17191e]">
            <Header />

            <div className="flex-1">{children}</div>

            <footer className="border-t border-[#e3e6eb] bg-white">
              <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-end gap-2 px-5 sm:px-10">
                <img
                  className="h-3 w-auto"
                  src="/images/logos/tmdb-logo.svg"
                  alt="TMDB"
                />
                <p className="text-[10px] text-[#606774]">
                  This product uses the TMDB API but is not endorsed or
                  certified by{" "}
                  <a
                    className="underline"
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TMDB.
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
