
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'primevariablecovers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'elimux.co.ke',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'furahainitiative.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'peopledialoguefestival.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
