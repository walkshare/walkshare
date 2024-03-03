<script lang="ts">
	import { Map as Mapbox } from '@beyonk/svelte-mapbox';
	import { createQuery } from '@tanstack/svelte-query';

	import Back from '~icons/ic/baseline-arrow-back';
	import { page } from '$app/stores';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { trpc } from '$lib/client';
	import PoiCard from '$lib/components/PoiCard.svelte';
	import { capitalize } from '$lib/util';

	let mapbox: Mapbox;
	let ready = false;

	$: event = createQuery({
		queryKey: ['event'],
		queryFn: () => trpc.event.getOne.query({ id: $page.params.id }),
	});

	$: joined = $event.isSuccess && $event.data.joined;

	function toggle() {
		joined = !joined;

		trpc.event[joined ? 'join' : 'leave'].mutate({ id: $page.params.id });
	}

	$: if ($event.isSuccess && ready) {
		fetch(`https://api.mapbox.com/directions/v5/mapbox/walking/${$event.data.itinerary.map(i => `${i.poi.longitude},${i.poi.latitude}`).join(';')}?geometries=geojson&access_token=${PUBLIC_MAPBOX_API_KEY}`)
			.then(async response => {
				const json = await response.json();

				const route = json.routes[0].geometry.coordinates;
				const geojson = {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: route,
					},
				};

				const map = mapbox.getMap();

				if (map.getSource('route')) {
					map.getSource('route').setData(geojson);
				} else {
					map.addLayer({
						id: 'route',
						type: 'line',
						source: {
							type: 'geojson',
							data: geojson,
						},
						layout: {
							'line-join': 'round',
							'line-cap': 'round',
						},
						paint: {
							'line-color': '#28b5e0',
							'line-width': 6,
						},
					});
				}

				const pointsGeoJSON = {
					type: 'FeatureCollection',
					features: $event.data?.itinerary.map(i => {
						const point = [i.poi.longitude, i.poi.latitude];

						return {
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'Point',
								coordinates: point,
							},
						};
					}),
				};

				map.addSource('route-points', {
					type: 'geojson',
					data: pointsGeoJSON,
				});

				map.addLayer({
					id: 'route-points-layer',
					type: 'circle',
					source: 'route-points',
					paint: {
						'circle-radius': 5,
						'circle-color': '#007cbf',
					},
				});
			});
	}
</script>

<a class="absolute top-4 left-4 btn btn-ghost btn-square rounded-full" href="/">
	<Back class="text-3xl" />
</a>

<div class="flex justify-center py-32">
	{#if $event.isError}
		{$event.error.message}
	{:else if $event.isLoading}
		loading...
	{:else if $event.isSuccess}
		<div class="max-w-3xl flex flex-col prose gap-8">
			<img
				alt={$event.data.name}
				src="/events/{$event.data.id}/thumbnail"
				class="rounded-2xl m-0 p-0"
			/>

			<div class="grid md:grid-cols-3">
				<div class="flex flex-row gap-2 flex-wrap relative md:col-span-2">
					{#each $event.data.tags as tag}
						<span class="badge badge-neutral badge-lg">{capitalize(tag)}</span>
					{/each}
				</div>

				<div class="flex flex-col place-items-end">
					<p class="p-0 m-0">{new Date($event.data.startsAt).toUTCString()}</p>
					<div class="flex gap-2 place-items-center">
						<p>
							{$event.data.count}
							{$event.data.count === 1 ? 'person' : 'people'} attending.
						</p>
						<button class="btn btn-primary w-fit" on:click={toggle}>
							{#if joined}
								Leave
							{:else}
								Join
							{/if}
						</button>
					</div>
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

			<div class="w-full h-96 rounded-xl overflow-hidden">
				<Mapbox
					bind:this={mapbox}
					on:ready={() => ready = true}
					accessToken={PUBLIC_MAPBOX_API_KEY}
					center={$event.data.itinerary[0] ? [$event.data.itinerary[0].poi.longitude, $event.data.itinerary[0].poi.latitude] : [-75.695, 45.424721]}
					style="mapbox://styles/mapbox/outdoors-v11"
					zoom={15}
				>
			
				</Mapbox>
			</div>
		</div>
	{/if}
</div>
