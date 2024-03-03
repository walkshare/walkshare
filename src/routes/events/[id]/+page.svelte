<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Back from '~icons/ic/baseline-arrow-back';
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import PoiCard from '$lib/components/PoiCard.svelte';
	import { capitalize } from '$lib/util';

	$: event = createQuery({
		queryKey: ['event'],
		queryFn: () => trpc.event.getOne.query({ id: $page.params.id }),
	});

	$: joined = $event.isSuccess && $event.data.joined;

	function toggle() {
		joined = !joined;
	
		trpc.event[joined ? 'join' : 'leave'].mutate({ id: $page.params.id });
	}
</script>

<a class="absolute top-4 left-4 btn btn-ghost" href="/">
	<Back class="text-3xl" />
</a>

<div class="flex justify-center py-32">
	{#if $event.isError}
		{$event.error.message}
	{:else if $event.isLoading}
		loading...
	{:else if $event.isSuccess}
		<div class="max-w-3xl flex flex-col prose gap-8">
			<img alt={$event.data.name} src="/events/{$event.data.id}/thumbnail" class="rounded-2xl m-0 p-0" />

			<div class="grid md:grid-cols-3">
				<div class="flex flex-row gap-2 flex-wrap relative md:col-span-2">
					{#each $event.data.tags as tag}
					<span class="badge badge-neutral badge-lg">{capitalize(tag)}</span>
					{/each}
				</div>

				<div class="flex flex-col gap-2 place-items-end">
					<p class="p-0 m-0">{new Date($event.data.startsAt).toUTCString()}</p>

					<button class="btn btn-primary w-fit" on:click={toggle}>
						{#if joined}
							Leave
						{:else}
							Join
						{/if}
					</button>
				</div>
			</div>

			<h1 class="m-0 p-0">{$event.data.name}</h1>

			<div class="prose">
				<!-- SAFETY: the description is sanitized server-side -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html $event.data.description}
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				{#each $event.data.itinerary as i}
					<PoiCard poi={i.poi} background />
				{/each}
			</div>
		</div>
	{/if}
</div>