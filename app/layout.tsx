import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "한글 격자 암호 변환기",
  description: "한글을 격자·X표 암호 기호로 변환합니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
