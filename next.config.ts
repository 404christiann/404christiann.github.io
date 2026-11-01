import type { NextConfig } from "next";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/founderfolio-apple.html' },
      ],
    };
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
