import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "wholara.org" }],
        destination: "https://www.wholara.org/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
