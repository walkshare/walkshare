<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { EventWithItinerary } from '$lib/server/schema';

	export let event: EventWithItinerary;
</script>

<div class="card w-full bg-base-100 shadow-xl">
  <figure class="relative">
		<img src="{PUBLIC_BASE_URL}/event/{event.id}/thumbnail" alt={event.name} />
		
		<div class="absolute top-0 left-0 flex flex-row flex-wrap gap-2">
			{#each event.tags as tag}
				<span class="badge badge-secondary">{tag}</span>
			{/each}
		</div>
	</figure>

  <div class="card-body prose max-w-full">
    <h2 class="card-title">{event.name}</h2>
		<h3>{event}</h3>

    <div class="line-clamp-5 prose max-w-full">
			<!-- SAFETY: the description is sanitized server-side -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html event.description}
		</div>

    <div class="card-actions justify-end">
      <button class="btn btn-primary ml-auto">See more</button>
    </div>
  </div>
</div>
