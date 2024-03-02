module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended'],
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	globals: {
		GeolocationCoordinates: true,
	},
	parserOptions: {
		project: 'tsconfig.json',
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		indent: ['error', 'tab', {
			SwitchCase: 1,
		}],
		quotes: ['error', 'single', { avoidEscape: true }],
		'quote-props': ['error', 'as-needed'],
		'comma-dangle': ['error', 'always-multiline'],
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
	}
};
