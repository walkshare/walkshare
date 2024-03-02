<script>
	import { RedocStandalone } from 'redoc-svelte';
</script>

<RedocStandalone
	specUrl="/docs/openapi.json"
	options={{
		nativeScrollbars: true,
		theme: { colors: { primary: { main: '#dd5522' } } },
	}}
/>
