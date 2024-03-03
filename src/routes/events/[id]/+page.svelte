<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import PoiCard from '$lib/components/PoiCard.svelte';

	$: event = createQuery({
		queryKey: ['event'],
		queryFn: () => trpc.event.getOne.query({ id: $page.params.id }),
	});

	$: joined = $event.isSuccess && $event.data.joined;

	function joinEvent() {
		trpc.event.join.mutate({ id: $page.params.id });

		joined = true;
	}

	function leaveEvent() {
		trpc.event.leave.mutate({ id: $page.params.id });

		joined = false;
	}
</script>

{#if $event.isError}
	{$event.error.message}
{:else if $event.isLoading}
	loading...
{:else if $event.isSuccess}
	<div class="p-4 rounded-lg shadow-md">
		<img alt="Event." src="/events/{$event.data.id}/thumbnail" />

		<h2 class="text-xl font-bold">{$event.data.name}</h2>
		<p>{$event.data.description}</p>

		<p>Starts at:</p>
		<p>{new Date($event.data.startsAt).toUTCString()}</p>

		<p>Ends at:</p>
		<p>{new Date($event.data.endsAt).toUTCString()}</p>

		<p>Tags:</p>
		{#each $event.data.tags as t}
			{t}
		{/each}

		{#if joined}
			<button class="btn" on:click={leaveEvent}> Leave </button>
		{:else}
			<button class="btn" on:click={joinEvent}> Join </button>
		{/if}

		{#each $event.data.itinerary as i}
			<PoiCard poi={i.poi} />
		{/each}
	</div>
{/if}
