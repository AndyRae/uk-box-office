/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'bo-black': '#070707',
				'bo-primary': '#10b981', // green
				'bo-metric-green': '#1A6622',
			},
		},
	},
	plugins: [],
};
