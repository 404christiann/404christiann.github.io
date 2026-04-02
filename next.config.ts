import type { NextConfig } from "next";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
