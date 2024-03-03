<script lang="ts">
	import { Map as Mapbox, Marker } from '@beyonk/svelte-mapbox';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	import Login from '~icons/ic/baseline-login';
	import Logout from '~icons/ic/baseline-logout';
	import Plus from '~icons/ic/baseline-plus';
	import Circle from '~icons/map/circle';
	import Pin from '~icons/map/postal-code';
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';
	import { publisher, subscriber, trpc } from '$lib/client';
	import EventCard from '$lib/components/EventCard.svelte';
	import { distance } from '$lib/util';

	import type { PageData } from './$types';

	export let data: PageData;

	let coords: [number, number] | undefined = undefined;
	let users = new Map<string, [number, number]>();

	const NOTIFICATION_DISTANCE_THRESHOLD = 15700;

	const notifiedPois: Set<string> = new Set();

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
			const { name, poi, id } = JSON.parse(
				message.getBinaryAttachment() as string,
			);

			if (id === data.user?.userId) return;

			toast.success(`${name} has arrived at ${poi}!`);
		});
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
			if (
				distance(coords[0], coords[1], point.latitude, point.longitude) <
				NOTIFICATION_DISTANCE_THRESHOLD
			) {
				if (notifiedPois.has(point.name)) continue;

				notifiedPois.add(point.name);

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
						popupClassName=""
					>
						<Pin class="text-2xl text-red-400" />

						<a slot="popup" href="/pois/{point.id}">
							<h1 class="text-lg font-bold">{point.name}</h1>
							<p class="text-md line-clamp-4">{point.description}</p>
						</a>
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
			<div class="flex flex-row place-content-between">
				<a
					class="btn btn-secondary m-4"
					href={data.user ? '/logout' : '/login'}
				>
					{#if data.user}
						<Logout />
						Logout
					{:else}
						<Login />
						Login
					{/if}
				</a>

				<a
					class="btn btn-primary m-4"
					href="/events/create"
				>
					<Plus /> Create event
				</a>
			</div>

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
	</div>
</div>

<style>
	:global(.mapboxgl-popup-content) {
		@apply bg-base-200 rounded-xl overflow-hidden p-6 !important;
	}

	:global(.mapboxgl-popup-tip) {
		border-top-color: transparent !important;
		border-bottom-color: transparent !important;
		border-left-color: transparent !important;
		border-right-color: transparent !important;
	}
</style>
