<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<form
	method="post"
	class="w-full h-full grid place-items-center items-center gap-8"
>
	{#if form?.message}
		<div>{form.message}</div>
	{/if}

	<div class="flex flex-col gap-8 bg-neutral p-6 rounded-lg">
		<h1 class=" text-center text-3xl font-bold">Login</h1>
		<input
			type="text"
			name="username"
			placeholder="Username"
			class="input"
			required
			maxlength={39}
		/>

		<input
			type="password"
			name="password"
			placeholder="Password"
			class="input"
			required
			maxlength={255}
		/>

		<button type="submit" class="btn"> Log in </button>
		<p class="text-center">
			Don't have an account? <a href="/register" class=" underline font-bold">
				Sign up
			</a>
		</p>
	</div>
</form>
