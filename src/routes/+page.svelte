<script lang="ts">
	import { Map, Marker } from '@beyonk/svelte-mapbox';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	import Plus from '~icons/ic/baseline-plus';
	import Circle from '~icons/map/circle';
	import Pin from '~icons/map/postal-code';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { trpc } from '$lib/client';
	import EventCard from '$lib/components/EventCard.svelte';

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

	$: points = createQuery({
		queryKey: ['points'],
		queryFn: () => trpc.poi.getAll.query({
			query: '',
			tags: [],
			lat: coords?.[1] ?? 0,
			lng: coords?.[0] ?? 0,
			distance: 0.2,
		}),
	});
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-center">
		<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>

		<Map
			accessToken={PUBLIC_MAPBOX_API_KEY}
			center={coords ?? [-75.695, 45.424721]}
			style="mapbox://styles/mapbox/outdoors-v11"
			zoom={15}
		>
			{#if coords}
				<Marker
					lat={coords[1]}
					lng={coords[0]}
					label="You are here"
					color={0xff0000}
				>
					<Circle class="text-2xl text-blue-500" />
				</Marker>
			{/if}

			{#if $points.isSuccess}
				{#each $points.data as point}
					<Marker
						lat={point.latitude}
						lng={point.longitude}
						label={point.name}
						color={0x00ff00}
					>
						<Pin class="text-2xl text-red-400" />
					</Marker>
				{/each}
			{/if}
		</Map>
	</div>

	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu p-4 w-full lg:w-[33vw] min-h-full bg-base-200 text-base-content">
			<div class="event-grid grid gap-4">
				{#if $events.isError}
					{$events.error.message}
				{:else if $events.isLoading}
					loading...
				{:else if $events.isSuccess}
					{#each $events.data as event}
						<EventCard {event} />
					{/each}
				{/if}
			</div>

			<a class="btn btn-primary mt-auto place-self-end" href="/events/create">
				<Plus /> Create event
			</a>
		</ul>
	</div>
</div>

<style>
	.event-grid {
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr))
	}
</style>
