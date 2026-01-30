import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.eu-west-3.amazonaws.com', // Replace region if different dynamic is needed, or just specific bucket
        pathname: '/**',
      },
      // Fallback for specific bucket exact match if wildcard fails or for strictness
      {
        protocol: 'https',
        hostname: 'faunapedia-medias.s3.eu-west-3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
