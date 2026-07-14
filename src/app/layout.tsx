import type { Metadata } from "next";
import { Cormorant_Garamond, Shippori_Mincho, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "COMMONS — Mockup",
  description: "審査制会員コミュニティ COMMONS のモックアップ（株式会社ONE LIKE 様向け）",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${shippori.variable} ${notoSans.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
