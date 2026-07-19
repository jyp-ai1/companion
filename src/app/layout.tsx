import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이음 — 나와 잘 맞는 활동과 친구 찾기",
  description:
    "50~75세를 위한 Age-Tech AI 플랫폼. 이음 타입 테스트로 나에게 맞는 모임과 친구를 찾아보세요.",
  keywords: ["시니어", "모임", "친구", "활동", "Age-Tech", "이음"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
