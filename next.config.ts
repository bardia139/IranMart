import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files under /IranMart; Cloudflare keeps its normal Next.js runtime.
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/IranMart",
        trailingSlash: true,
      }
    : {}),
  images: { unoptimized: true },
};

export default nextConfig;
