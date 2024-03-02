/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,svelte,ts}',
	],
	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
}
