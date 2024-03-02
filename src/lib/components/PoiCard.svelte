<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { Poi } from '$lib/server/schema';

	export let poi: Poi;
</script>

<div class="card w-full bg-base-100 shadow-xl">
	<figure class="relative">
		<img src="{PUBLIC_BASE_URL}/event/{poi.id}/thumbnail" alt={poi.name} />

		<div class="absolute top-0 left-0 flex flex-row flex-wrap gap-2">
			{#each poi.tags as tag}
				<span class="badge badge-secondary">{tag}</span>
			{/each}
		</div>
	</figure>

	<div class="card-body prose max-w-full">
		<h2 class="card-title">{poi.name}</h2>
		<h3>{poi.address}</h3>

		<div class="line-clamp-5 prose max-w-full">
			<!-- SAFETY: the description is sanitized server-side -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html poi.description}
		</div>

		<div class="card-actions justify-end">
			<button class="btn btn-primary ml-auto">See more</button>
		</div>
	</div>
</div>
