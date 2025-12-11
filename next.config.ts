import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com", // MUX video thumbnails
      },
      {
        protocol: "https",
        hostname: "**.xano.io", // Xano uploaded files/images
      },
    ],
  },
};

export default nextConfig;
