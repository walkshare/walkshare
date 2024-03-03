<script lang="ts">
	import 'flatpickr/dist/themes/dark.css';

	import { TRPCClientError } from '@trpc/client';
	import Flatpickr from 'svelte-flatpickr';

	import { trpc } from '$lib/client';
	import PoiCard from '$lib/components/PoiCard.svelte';
	import type { Poi } from '$lib/server/schema';

	let hovering = false;
	let input: HTMLInputElement;
	let files: FileList;

	let event = {
		name: '',
		description: '',
		tags: [] as string[],
		thumbnail: '',
		startsAt: new Date(),
	};

	let itinerary: Poi[] = [];

	async function submit() {
		try {
			await trpc.event.create.mutate({
				...event,
				itinerary: itinerary.map(poi => poi.id),
			});
		} catch (e) {
			if (e instanceof TRPCClientError) {
				error = e.message;
			}
		}
	}

	function addTag() {
		event.tags.push(tag);
		event = event;
		tag = '';
	}

	async function createItinerary() {
		navigator.geolocation.getCurrentPosition(async (position) => {
			itinerary = await trpc.itinerary.create.query({
				lat: position.coords.latitude,
				long: position.coords.longitude,
			});
		});
	}

	let error: string | undefined = undefined;
	let tag: string;
</script>

<div class="flex justify-center pt-32">
	<form class="max-w-4xl w-full grid md:grid-cols-2 gap-4">
		<div class="flex flex-col gap-4 prose">
			<input bind:value={event.name} class="input rounded-xl border-none bg-base-200 p-4" placeholder="Add name..." />
			<textarea bind:value={event.description} class="textarea rounded-xl bg-base-200 p-4 min-h-96" placeholder="Add description..." />

			{#if error}
				{error}
			{/if}

			<h2>Itinerary</h2>
			<button on:click={createItinerary}>
				generate itinerary :sparkles:
			</button>

			<div class="itinerary-grid grid gap-2">
				{#each itinerary as poi}
					<PoiCard {poi} />
				{/each}
			</div>

			<button class="btn" on:click={submit}> Create </button>
		</div>

		<div class="flex flex-col gap-2">
			<button
				class="bg-base-300 rounded-3xl aspect-video flex place-items-center justify-center relative w-full h-60"
				on:click={() => input.click()}
				on:dragenter|preventDefault={() => {
					hovering = true;
				}}
				on:dragleave|preventDefault={() => {
					hovering = false;
				}}
				on:drop|preventDefault={(e) => {
					if (e.dataTransfer) files = e.dataTransfer.files;
					hovering = false;
				}}
			>
				<div
					class="w-full h-full absolute top-0 left-0 rounded-2xl opacity-75 transition-all duration-300 border-primary"
					class:border-8={hovering}
				/>

				{#if event.thumbnail}
					<img
						class="object-cover rounded-2xl w-full h-full m-0"
						src={event.thumbnail}
						alt={event.name}
					/>
				{:else if hovering}
					upload
				{:else}
					add photo
				{/if}

				<input
					type="file"
					class="hidden"
					bind:files
					bind:this={input}
					accept="image/*"
				/>
			</button>

			<div class="flex flex-col gap-2 flex-wrap">
				<Flatpickr
					options={{
						mode: 'single',
						dateFormat: 'l, F J Y h:i K',
					}}
					name="date"
					bind:value={event.startsAt}
					class="input rounded-xl border-none bg-base-200 p-4 cursor-pointer w-full"
				/>

				{#each event.tags as tag}
					<div class="badge badge-neutral badge-lg">{tag}</div>
				{/each}

				<form on:submit|preventDefault={addTag}>
					<input class="badge badge-neutral badge-lg" placeholder="Add tag..." bind:value={tag} />
				</form>
			</div>
		</div>
	</form>
</div>

<style>
	.itinerary-grid {
		grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr))
	}
</style>
