/** @type {import('next').NextConfig} */
const isNetlify = process.env.NETLIFY === 'true';
const r2PublicHost = process.env.R2_PUBLIC_HOST; // e.g. cdn.cf-hub.example.com

const remotePatterns = [
  { protocol: 'http', hostname: 'localhost', port: '8008', pathname: '/api/blog/posts/**/cover' },
];

if (r2PublicHost) {
  remotePatterns.push({ protocol: 'https', hostname: r2PublicHost });
}

// Allow broader https sources in Netlify preview contexts if needed
if (isNetlify) {
  remotePatterns.push({ protocol: 'https', hostname: '**' });
}

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost', ...(r2PublicHost ? [r2PublicHost] : [])],
    remotePatterns,
    ...(isNetlify ? { unoptimized: true } : {}),
  },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = { ...config.resolve.alias, '@': './src' };
    return config;
  },
};

export default nextConfig;
