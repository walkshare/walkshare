<script lang="ts">
	import { Map, Marker } from '@beyonk/svelte-mapbox';
	import { onMount } from 'svelte';
	
	import { PUBLIC_MAPBOX_API_KEY } from '$env/static/public';

	let coords: [number, number] = [0, 0];

	onMount(() => {
		navigator.geolocation.watchPosition(position => {
			coords = [position.coords.longitude, position.coords.latitude];
		});
	});
</script>

<div class="grid grid-cols-3">
	<div class="h-full bg-base-200">

	</div>

	<div id="map" class="w-full h-full">
		<Map
			accessToken={PUBLIC_MAPBOX_API_KEY}
			center={coords}
			style="mapbox://styles/mapbox/dark-v11"
			zoom={15}
		>
			<Marker
				lat={coords[1]}
				lng={coords[0]}
				label="You are here"
				color={0xff0000}
			/>
		</Map>
	</div>	
</div>
