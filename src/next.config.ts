
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
