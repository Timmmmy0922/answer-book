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
        {/*
          字体全部托管在自己的 public/fonts/ 下，访客不会连到 fonts.googleapis.com
          —— 那个域名在中国大陆打不开，一连就会退回系统宋体、排版走样。

          这里故意用「相对路径」而不是 /fonts/...：
          GitHub Pages 的网址带子路径（/answer-book/），相对路径在
          根目录和子路径下都能正确解析，不用为两套环境写两份。
        */}
        <link rel="stylesheet" href="fonts/noto-serif-sc.css" />
        <link rel="stylesheet" href="fonts/cormorant-garamond.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
