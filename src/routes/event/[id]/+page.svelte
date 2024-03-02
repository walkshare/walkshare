<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';

	$: event = createQuery({
		queryKey: ['event'],
		queryFn: () => trpc.event.getOne.query($page.params.id),
	});
</script>

{#if $event.isError}
	{$event.error.message}
{:else if $event.isLoading}
	loading...
{:else if $event.isSuccess}
	<div class="bg-white p-4 rounded-lg shadow-md">
		<h2 class="text-xl font-bold">{$event.data.name}</h2>
		<p>{$event.data.description}</p>
	</div>
{/if}
