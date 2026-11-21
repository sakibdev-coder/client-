import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }]
  },
  async rewrites() {
    const apiServer = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/api\/?$/, "");
    return [
      { source: "/api/better-auth/:path*", destination: `${apiServer}/api/better-auth/:path*` },
      { source: "/api/auth/google-session", destination: `${apiServer}/api/auth/google-session` }
    ];
  }
};

export default nextConfig;
