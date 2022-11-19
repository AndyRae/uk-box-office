/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'bo-primary': '#B65078', // red
				// 'bo-primary': '#E77975', // orange
				'bo-white:': '#f8f8f9',
				'bo-blue': '#152f57',
			},
		},
	},
	plugins: [],
};
