import type { NextConfig } from "next";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'troika-three-text'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
