import type { Metadata } from "next";
import { Cormorant_Garamond, Shippori_Mincho, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

// 描画前にテーマを適用してちらつきを防ぐ
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("commons-theme");if(t==="ivory"){document.documentElement.dataset.theme="ivory"}}catch(e){}`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
