<script lang="ts">
	import '../app.css';

	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import Navbar from '$lib/components/Navbar.svelte';

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<slot/>
</QueryClientProvider>
