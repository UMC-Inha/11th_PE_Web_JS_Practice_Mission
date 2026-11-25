import type { Metadata } from "next";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
