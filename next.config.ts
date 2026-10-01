import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos are pre-optimised by scripts/media.mjs; uploads are resized in the browser before upload.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
