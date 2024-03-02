<script>
	import { RedocStandalone } from 'redoc-svelte';
</script>

<div class="w-screen min-h-screen bg-white">
	<RedocStandalone
		specUrl="/docs/openapi.json"
		options={{
			nativeScrollbars: true,
			theme: { colors: { primary: { main: '#dd5522' } } },
		}}
	/>
</div>
