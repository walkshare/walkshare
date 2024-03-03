<script lang="ts">
	import Arrow from '~icons/ic/baseline-arrow-forward';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { EventWithItinerary } from '$lib/server/schema';
	import { capitalize } from '$lib/util';

	export let event: Omit<EventWithItinerary, 'startsAt' | 'createdAt'> & {
		startsAt: string;
		createdAt?: string;
	};
</script>

<a
	class="card w-full hover:bg-neutral p-2 duration-200 transition-all bg-base-100"
	href="/events/{event.id}"
>
	<figure class="relative">
		<div class="w-full h-32 bg-base-300 rounded-xl overflow-hidden">
			<img
				src="{PUBLIC_BASE_URL}/events/{event.id}/thumbnail"
				alt={event.name}
			/>
		</div>

		<div class="absolute top-2 left-2 flex flex-row flex-wrap gap-2">
			{#each event.tags.slice(0, 3) as tag}
				<span class="badge badge-secondary bg-white border-white"
					>{capitalize(tag)}</span
				>
			{/each}
		</div>
	</figure>

	<div class="card-body p-0 pl-2 pt-2 prose max-w-full">
		<h2 class="card-title">{event.name}</h2>

		<div class="line-clamp-5 prose max-w-full">
			<!-- SAFETY: the description is sanitized server-side -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html event.description}
		</div>

		<div class="card-actions justify-end">
			<button class="btn btn-sm btn-primary ml-auto">See more <Arrow /></button>
		</div>
	</div>
</a>
