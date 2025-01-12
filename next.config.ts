import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'solarmax.com.pk',
          pathname: '**',
        },
      ],
    // domains: ['localhost'],
},
};

export default nextConfig;
