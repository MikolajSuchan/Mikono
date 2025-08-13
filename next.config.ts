import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true, // stałe przekierowanie (308)
      },
    ];
  },
};

export default nextConfig;
