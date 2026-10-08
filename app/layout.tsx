import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "答案之书 · 迷路的旅人啊",
  description:
    "迷路的旅人啊，在此处与答案之书链接，解开你心中的困惑吧。爱情、事业、健康、学业、整体运势——写下你的困惑，翻开一页。",
  applicationName: "答案之书",
  keywords: ["答案之书", "Book of Answers", "占卜", "神谕", "答案"],
  openGraph: {
    title: "答案之书 · 迷路的旅人啊",
    description: "在此处与答案之书链接，解开你心中的困惑吧。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EAD9",
  width: "device-width",
  initialScale: 1,
  // 让 env(safe-area-inset-*) 在刘海屏 / 挖孔屏上真的拿得到值
  viewportFit: "cover",
  // 允许用户缩放（无障碍），但默认不放大
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* 载入失败也不影响：CSS 里有宋体回退栈 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
