/** @type {import('next').NextConfig} */
const isNetlify = process.env.NETLIFY === 'true';
const r2PublicHost = process.env.R2_PUBLIC_HOST; // e.g. cdn.cf-hub.example.com

const remotePatterns = [
  { protocol: 'http', hostname: 'localhost', port: '8008', pathname: '/api/blog/posts/**/cover' },
  { protocol: 'https', hostname: 'pub-563dc0627c35466bbf0456ec4ee3d5a3.r2.dev' },
];

if (r2PublicHost) {
  remotePatterns.push({ protocol: 'https', hostname: r2PublicHost });
}

// Allow broader https sources in Netlify preview contexts if needed
if (isNetlify) {
  remotePatterns.push({ protocol: 'https', hostname: '**' });
}

const nextConfig = {
  // Ensure server output (not static export). Standalone works well with Netlify Next plugin.
  output: 'standalone',
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
