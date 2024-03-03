import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,svelte,ts}',
	],
	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
	daisyui: {
		themes: [
			{
				dark: {
					...themes.dark,
					primary: '#A3D8F4',
					secondary: '#F4E4A2',
					accent: '#B9E4C9',
				}
			}
		],
	},
}
