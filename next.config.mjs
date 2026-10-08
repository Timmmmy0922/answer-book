/**
 * 说明：
 *   本机开发 / Vercel 部署 —— 走正常的 Next.js 伺服器模式，网址是根目录 /。
 *   GitHub Pages 部署   —— 只有 CI 会把 GITHUB_PAGES 设成 "true"，
 *                          这时才打开静态导出，并把 basePath 设成 /answer-book
 *                          （因为项目站的网址是 https://<帐号>.github.io/answer-book/）。
 *
 * 这样本机 npm run dev 依然是 http://localhost:3000，不受影响。
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

if (isGitHubPages) {
  nextConfig.output = "export";
  nextConfig.basePath = "/answer-book";
  nextConfig.assetPrefix = "/answer-book";
  nextConfig.images = { unoptimized: true };
  // 静态导出没有伺服器，用尾斜线让 /answer-book/ 直接命中 index.html
  nextConfig.trailingSlash = true;
}

export default nextConfig;
