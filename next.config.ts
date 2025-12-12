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
      {
        protocol: "https",
        hostname: "**.gstatic.com", // Google images
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Google user content
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Placeholder images
      },
    ],
  },
};

export default nextConfig;
