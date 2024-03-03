import replace from '@rollup/plugin-replace';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		replace({
			preventAssignment: true,
			values: {
				"from 'dayjs": "from 'dayjs/esm",
			},
		}),
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
	],
	ssr: {
		noExternal: ['dayjs'],
	},
	build: {
		rollupOptions: {
			external: [
				'sharp',
			],
		},
	},
});
