<script lang="ts">
  import { Map, Marker } from "@beyonk/svelte-mapbox";
  import { onMount } from "svelte";
  import Pin from "~icons/map/postal-code";

  import { PUBLIC_MAPBOX_API_KEY } from "$env/static/public";

  let coords: [number, number] = [0, 0];

  onMount(() => {
    navigator.geolocation.watchPosition((position) => {
      coords = [position.coords.longitude, position.coords.latitude];
    });
  });
</script>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    <!-- Page content here -->
    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden"
      >Open drawer</label
    >

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
      >
        <Pin class="text-2xl text-red-400"></Pin>
      </Marker>
    </Map>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
