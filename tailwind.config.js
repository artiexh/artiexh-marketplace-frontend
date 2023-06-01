/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				primary: '#F10487',
				secondary: '#8924C2',
				subtext: '#AFAFAF',
			},
			backgroundColor: {
				body: '#F8F9FA',
			},
		},
	},
	plugins: [],
};
