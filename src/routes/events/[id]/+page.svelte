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

<div class="flex justify-center pt-32">
	{#if $event.isError}
		{$event.error.message}
	{:else if $event.isLoading}
		loading...
	{:else if $event.isSuccess}
		<div class="max-w-3xl p-4 flex flex-col gap-8">
			<img alt={$event.data.name} src="/events/{$event.data.id}/thumbnail" class="rounded-2xl" />

			<div class="flex flex-row gap-2 flex-wrap relative">
				{#each $event.data.tags as tag}
					<span class="badge badge-neutral badge-lg">{tag}</span>
				{/each}

				<p class="absolute right-0">{new Date($event.data.startsAt).toUTCString()}</p>
			</div>

			<h1 class="text-xl font-bold">{$event.data.name}</h1>

			<div class="prose">
				<!-- SAFETY: the description is sanitized server-side -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html $event.data.description}
			</div>

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
</div>