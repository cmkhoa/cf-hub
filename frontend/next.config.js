/** @type {import('next').NextConfig} */
const isNetlify = process.env.NETLIFY === 'true';

// Common image config (augmented with unoptimized flag on Netlify)
const imageConfig = {
  domains: ['images.unsplash.com', 'localhost'],
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8008',
      pathname: '/api/blog/posts/**/cover',
    },
       // Vercel Blob public URLs
       {
         protocol: 'https',
         hostname: '**.public.blob.vercel-storage.com',
       },
    // Allow any https host when on Netlify export (can refine later)
    ...(isNetlify
      ? [
          {
            protocol: 'https',
            hostname: '**',
          },
        ]
      : []),
  ],
  ...(isNetlify ? { unoptimized: true } : {}),
};

const nextConfig = {
  images: imageConfig,
  ...(isNetlify && { output: 'export' }),
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
};

export default nextConfig;
