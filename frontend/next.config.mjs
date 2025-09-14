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
