<script lang="ts">
	import 'flatpickr/dist/themes/dark.css';

	import { TRPCClientError } from '@trpc/client';
	import Flatpickr from 'svelte-flatpickr';

	import Arrow from '~icons/ic/baseline-arrow-forward';
	import Sparkles from '~icons/ic/baseline-auto-awesome';
	import { goto } from '$app/navigation';
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
	let loadingItinerary = false;

	$: {
		if (files) {
			const file = files[0];
			const reader = new FileReader();

			reader.onload = () => {
				event.thumbnail = reader.result as string;
			};

			reader.readAsDataURL(file);
		}
	}

	async function submit() {
		try {
			const id = await trpc.event.create.mutate({
				...event,
				itinerary: itinerary.map(poi => poi.id),
			});

			// navigate to the event page
			goto(`/events/${id}`);
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
			loadingItinerary = true;
			itinerary = await trpc.itinerary.create.query({
				lat: position.coords.latitude,
				long: position.coords.longitude,
			});
			loadingItinerary = false;
		});
	}

	let error: string | undefined = undefined;
	let tag: string;
</script>

<div class="flex justify-center pt-32">
	<form class="max-w-4xl w-full grid md:grid-cols-2 gap-x-4 gap-y-16" on:submit|preventDefault={submit}>
		<div class="flex flex-col gap-4 prose">
			<input bind:value={event.name} class="input rounded-xl border-none bg-base-200 p-4" placeholder="Add name..." />
			<textarea bind:value={event.description} class="textarea rounded-xl bg-base-200 p-4 min-h-96" placeholder="Add description..." />

			{#if error}
				{error}
			{/if}
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

		<div class="flex flex-col gap-4 prose">
			<h2>Itinerary</h2>

			{#if itinerary.length}
				<div class="itinerarygrid gap-2 lg:grid-cols-3 col-span-2">
					{#each itinerary as poi}
						<PoiCard {poi} background />
					{/each}
				</div>
			{:else}
				<div class="flex flex-row flex-wrap gap-2 col-span-2">
					<span>You don't have an itinerary yet.</span>
					<button class="btn btn-accent btn-sm w-fit" on:click={createItinerary}>
						{#if loadingItinerary}
							<span class="loading loading-dots loading-sm"></span>
						{/if}

						Create itinerary <Sparkles />
					</button>
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-4 prose">
			<button class="btn btn-primary mt-auto place-self-end">
				Create <Arrow />
			</button>
		</div>
	</form>
</div>
