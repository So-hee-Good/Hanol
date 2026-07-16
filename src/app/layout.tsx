import type { Metadata } from "next";
import { Geist_Mono, Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const display = Nanum_Myeongjo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const body = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hanol · 수업 횟수 관리",
  description:
    "월 납부가 아닌 수업 횟수 패키지 기준으로 출석·등록을 관리하는 학원 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
