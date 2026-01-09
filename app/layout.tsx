import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 브릿지저스 겨울수련회 참가신청",
  description: "청지기 - 청년이여, 지금 기도하라!",
  icons: {
    icon: '/BridgeJesusLogo.png',
    apple: '/BridgeJesusLogo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
