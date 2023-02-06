/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	reactStrictMode: true,
	modularizeImports: {
		'@react-icons/ai': {
			transform: '@react-icons/ai/{{member}}',
		},
		'@react-icons/bi': {
			transform: '@react-icons/bi/{{member}}',
		},
		'@react-icons/bs': {
			transform: '@react-icons/bs/{{member}}',
		},
		'@react-icons/hi': {
			transform: '@react-icons/hi/{{member}}',
		},
		'@react-icons/fi': {
			transform: '@react-icons/fi/{{member}}',
		},
		'@react-icons/fa': {
			transform: '@react-icons/fa/{{member}}',
		},
		'@react-icons/md': {
			transform: '@react-icons/md/{{member}}',
		},
	},
	async redirects() {
		return [
			{
				source: '/films/:path*',
				destination: 'film/:path*',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
