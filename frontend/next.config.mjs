/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// Keep simple domain allow-list for providers without custom ports
		domains: ["images.unsplash.com", "localhost"],
		// Explicit remotePatterns so Next Image optimizer accepts backend served covers (http://localhost:8008/...)
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8008',
				pathname: '/api/blog/posts/*/cover',
			},
			// Vercel Blob public URLs
			{
				protocol: 'https',
				hostname: '**.public.blob.vercel-storage.com',
			},
		],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@': './src',
		};
		return config;
	},
};

export default nextConfig;
