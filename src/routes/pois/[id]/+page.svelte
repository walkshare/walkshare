<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Back from '~icons/ic/baseline-arrow-back';
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { capitalize } from '$lib/util';

	$: poi = createQuery({
		queryKey: ['poi'],
		queryFn: () => trpc.poi.getOne.query({ id: $page.params.id }),
	});
</script>

<a class="absolute top-4 left-4" href="/">
	<Back class="text-3xl" />
</a>

<div class="flex justify-center py-32">
	{#if $poi.isError}
		{$poi.error.message}
	{:else if $poi.isLoading}
		loading...
	{:else if $poi.isSuccess}
		<div class="max-w-3xl flex flex-col prose gap-8">
			<img alt={$poi.data.name} src="/pois/{$poi.data.id}/thumbnail" class="rounded-2xl m-0 p-0" />

			<div class="grid md:grid-cols-3">
				<div class="flex flex-row gap-2 flex-wrap relative md:col-span-2">
					{#each $poi.data.tags as tag}
						<span class="badge badge-neutral badge-lg">{capitalize(tag)}</span>
					{/each}
				</div>
			</div>

			<h1 class="m-0 p-0">{$poi.data.name}</h1>

			<div class="prose">
				<!-- SAFETY: the description is sanitized server-side -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html $poi.data.description}
			</div>
		</div>
	{/if}
</div>