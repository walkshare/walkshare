<script lang="ts">
	import { Map as Mapbox, Marker } from '@beyonk/svelte-mapbox';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	import Plus from '~icons/ic/baseline-plus';
	import Circle from '~icons/map/circle';
	import Pin from '~icons/map/postal-code';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { publisher, subscriber, trpc } from '$lib/client';
	import EventCard from '$lib/components/EventCard.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import type { PageData } from './$types';
	import { distance } from '$lib/util';

	export let data: PageData;

	let coords: [number, number] | undefined = undefined;
	let users = new Map<string, [number, number]>();

	onMount(() => {
		navigator.geolocation.watchPosition((position) => {
			coords = [position.coords.longitude, position.coords.latitude];

			if (data.user) {
				publisher.publish(
					'location',
					JSON.stringify({
						coords,
						id: data.user.userId,
					}),
				);
			}
		});

		subscriber.subscribe('location', (message) => {
			const { coords, id } = JSON.parse(
				message.getBinaryAttachment() as string,
			);
			if (id === data.user?.userId) return;

			users.set(id, coords);
			users = users;

			console.log('received', coords, 'from', id);
		});

		subscriber.subscribe('join', () => {
			if (data.user) {
				publisher.publish(
					'location',
					JSON.stringify({
						coords,
						id: data.user.userId,
					}),
				);
			}
		});

		publisher.publish('join', '');

		subscriber.subscribe('close', (message) => {
			
		})
	});

	const events = createQuery({
		queryKey: ['events'],
		queryFn: () =>
			trpc.event.getAll.mutate({
				query: '',
				tags: [],
				page: 1,
				limit: 10,
			}),
	});

	const points = createQuery({
		queryKey: ['points'],
		queryFn: () =>
			trpc.poi.getAll.mutate({
				query: '',
				tags: [],
				lat: coords?.[1] ?? 0,
				lng: coords?.[0] ?? 0,
				distance: 0.2,
			}),
	});

	$: if (data.user && $points.isSuccess && coords) {
		for (const point of $points.data) {
			if (distance(coords, [point.latitude, point.longitude]) < 5) {
				publisher.publish(
					'close',
					JSON.stringify({
						id: data.user.userId,
						poi: point.name,
						name: data.user.username,
					}),
				);
			}
		}
	}
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-center justify-center">
		<label for="sidebar" class="btn btn-primary drawer-button lg:hidden">
			Open drawer
		</label>

		<Mapbox
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

			{#each Array.from(users.entries()) as [id, coords]}
				<Marker
					lat={coords[1]}
					lng={coords[0]}
					label="Another user ({id})"
					color={0x0000ff}
				>
					<Circle class="text-2xl text-green-500" />
				</Marker>
			{/each}
		</Mapbox>
	</div>

	<div class="drawer-side">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay" />
		<ul
			class="menu p-0 w-full lg:w-[33vw] min-h-full bg-base-200 text-base-content"
		>
			<Navbar />

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
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
		</ul>

		<a
			class="btn btn-primary m-4 absolute bottom-2 right-2"
			href="/events/create"
		>
			<Plus /> Create event
		</a>
	</div>
</div>
