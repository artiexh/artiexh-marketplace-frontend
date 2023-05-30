/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
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
