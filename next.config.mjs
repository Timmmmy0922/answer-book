/**
 * 部署形态说明
 * ────────────────────────────────────────────────────────────
 *   本机开发            不设任何变数 → 正常 Next.js 伺服器模式，http://localhost:3000
 *   GitHub Pages        设 STATIC_EXPORT=true + BASE_PATH=/answer-book
 *   腾讯云 EdgeOne Pages 设 STATIC_EXPORT=true（BASE_PATH 留空，网址在网域根目录）
 *   阿里云 OSS / 七牛    同上，STATIC_EXPORT=true
 *   Vercel / 自架伺服器   什么都不用设
 *
 * 为什么可以这样切：这本答案之书是「纯静态」的 ——
 *   1000 条答案都在前端 data/answers.json 里，翻书抽签全在浏览器完成，
 *   只有「记一笔到后台」才需要连 Supabase。所以任何静态空间都能放。
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = (process.env.BASE_PATH || "").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

if (isStaticExport) {
  nextConfig.output = "export";
  if (basePath) {
    // 项目站网址带子路径时（例如 /answer-book/），资源路径要跟着加前缀
    nextConfig.basePath = basePath;
    nextConfig.assetPrefix = basePath;
  }
  nextConfig.images = { unoptimized: true };
  // 静态空间靠目录 index.html 定位，尾斜线让 /answer-book/ 直接命中
  nextConfig.trailingSlash = true;
}

export default nextConfig;
