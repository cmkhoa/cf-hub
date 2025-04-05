/** @type {import('next').NextConfig} */
const isNetlify = process.env.NETLIFY === 'true';

const nextConfig = {
  ...(isNetlify && {
    output: 'export',
    images: {
      unoptimized: true,
      remotePatterns: [{ protocol: 'https', hostname: '**' }],
    },
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
