<script lang="ts">
	import { TRPCClientError } from '@trpc/client';
	import { DateInput } from 'date-picker-svelte';

	import { trpc } from '$lib/client';
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
		endsAt: new Date(),
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

<div class="flex justify-center">
	<form class="max-w-7xl prose flex flex-col">
		<button
			class="bg-base-300 rounded-2xl aspect-video flex place-items-center justify-center relative w-full h-full"
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

		<input bind:value={event.name} class="input" placeholder="Add name..." />

		<textarea bind:value={event.description} class="textarea" placeholder="Add description..."></textarea>

		{#each event.tags as t}
			{t}
		{/each}

		<form on:submit|preventDefault={addTag}>
			<input class="input" placeholder="Add tag..." bind:value={tag} />
		</form>

		<div class="label">
			<span class="label-text">Starts at:</span>
		</div>
		<DateInput bind:value={event.startsAt} class="w-full" id="starts-at" />

		<div class="label">
			<span class="label-text">Ends at:</span>
		</div>
		<DateInput bind:value={event.startsAt} class="w-full" id="starts-at" />

		{#if error}
			{error}
		{/if}

		<h2>Itinerary</h2>
		<button on:click={createItinerary}>
			generate itinerary :sparkles:
		</button>

		<div  class="itinerary-grid grid gap-2">
			{#each itinerary as poi}
				<div>
					{poi.name}
				</div>
			{/each}
		</div>

		<button class="btn" on:click={submit}> Create </button>
	</form>
</div>

<style>
	.itinerary-grid {
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr))
	}
</style>
