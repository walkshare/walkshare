<script lang="ts">
	import { Map, Marker } from '@beyonk/svelte-mapbox';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { trpc } from '$lib/client';

	let coords: [number, number] | undefined = undefined;

	onMount(() => {
		navigator.geolocation.watchPosition(position => {
			coords = [position.coords.longitude, position.coords.latitude];
		});
	});

	$: events = createQuery({
		queryKey: ['events'],
		queryFn: () => trpc.event.getAll.query({
			query: '',
			tags: [],
			page: 1,
			limit: 10,
		}),
	});
</script>

{#if coords}
	<div class="w-screen h-screen grid grid-cols-2">
		<div class="event-grid grid gap-4">
			{#if $events.isError}
				{$events.error.message}
			{:else if $events.isLoading}
				loading...
			{:else if $events.isSuccess}
				{#each $events.data as event}
					<div class="bg-white p-4 rounded-lg shadow-md">
						<h2 class="text-xl font-bold">{event.name}</h2>
						<p>{event.description}</p>
					</div>
				{/each}
			{/if}
		</div>

		<Map
			accessToken={PUBLIC_MAPBOX_API_KEY}
			center={coords}
			style="mapbox://styles/mapbox/outdoors-v11"
			zoom={15}
		>
			<Marker
				lat={coords[1]}
				lng={coords[0]}
				label="You are here"
				color={0xff0000}
				popupClassName="bg-red-500"
			>
				<svelte:fragment slot="popup">
					hello buddy
				</svelte:fragment>
			</Marker>
		</Map>
	</div>
{:else}
	loading...
{/if}

<style>
	.event-grid {
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr))
	}
</style>
