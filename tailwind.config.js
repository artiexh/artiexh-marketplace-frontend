/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				primary: '#50207D',
				secondary: '#683696',
				subtext: '#9E9E9E',
				'gray-primary': '#c1c1c1',
			},
			backgroundColor: {
				body: '#F8F9FA',
				accent: '#F3F5F9',
			},
		},
	},
	plugins: [],
};
