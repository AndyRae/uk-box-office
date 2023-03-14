/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'bo-black': '#000000',
				'bo-grey': '#F5F5F7',
				// 'bo-grey': '#F8F8F9',
				'bo-black': '#070707',
				// 'bo-black': '#1D1D1F',
				'bo-slate': '#1C1C1C',
				'bo-primary': '#10b981', // green
				'bo-white:': '#f8f8f9',
				'bo-blue': '#152f57',
				'bo-metric-green': '#1A6622',
			},
		},
	},
	plugins: [],
};
