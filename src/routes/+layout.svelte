<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<slot/>
</QueryClientProvider>
