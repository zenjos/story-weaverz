import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "漫剧工坊 — AI 漫剧创作平台",
  description:
    "输入一本小说，AI 自动把它拍成一部漫剧。自动拆解角色、场景、分镜，保证人物和场景一致性。",
  keywords: [
    "AI 漫剧",
    "小说转漫剧",
    "角色一致性",
    "AI 创作",
    "漫画生成",
    "漫剧工坊",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "漫剧工坊 — AI 漫剧创作平台",
    description: "输入小说，AI 自动生成漫剧，角色和场景保持一致。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
