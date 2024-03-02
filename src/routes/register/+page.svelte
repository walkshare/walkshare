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

	<div class="flex flex-col gap-6 bg-neutral p-8 rounded-lg">
		<h1 class=" text-center text-3xl font-bold">Register</h1>
		<input
			type="text"
			name="name"
			placeholder="Name"
			class="input"
			required
			maxlength={255}
		/>

		<input
			type="text"
			name="username"
			placeholder="Username"
			required
			class="input"
			maxlength={39}
		/>

		<input
			type="password"
			name="password"
			class="input input-bordered"
			placeholder="Password"
			required
			maxlength={255}
		/>

		<button type="submit" class="btn"> Sign up </button>

		<p class="text-center">
			Already have an account? <a href="/login" class=" underline font-bold">
				Log in
			</a>
		</p>
	</div>
</form>
