import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-next",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "HANOL Manager",
  description: "HANOL 학원 관리 Sprint 1 MVP — 학생·출결·수납·문자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={display.variable}>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
