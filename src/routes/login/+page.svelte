<script lang="ts">
  import type { ActionData } from "./$types";
  import background from "$lib/assets/background.png";

  export let form: ActionData;

  let showPassword = false;
</script>

<div
  class="flex flex-col gap-8 justify-center place-items-center min-h-screen px-8 object-fill"
>
  <img
    src={background}
    class="absolute -z-50 blur-sm object-fill h-auto max-w-full opacity-50 scale-150"
  />
  <form
    method="post"
    class="w-full h-full grid place-items-center items-center gap-8 rounded-xl"
  >
    <div class="flex flex-col bg-neutral p-6 rounded-lg w-96">
      <h1 class=" text-center text-3xl font-bold m-4">Login</h1>
      {#if form?.message}
        <div class="alert alert-error">{form.message}</div>
      {/if}
      <label class="label" for="username">
        <span class="label-text"> Username </span>
      </label>
      <input
        type="text"
        name="username"
        placeholder="Username"
        class="input"
        required
        maxlength={39}
      />

      <label class="label" for="password">
        <span class="label-text"> Password </span>
        <button
          type="button"
          class="label-text flex flex-row gap-1 place-items-center text-xs"
          on:click={() => (showPassword = !showPassword)}
        >
          {#if showPassword}
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
              />
            </svg>

            hide
          {:else}
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              />
            </svg>

            show
          {/if}
        </button>
      </label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        class="input"
        required
        maxlength={255}
      />

      <button type="submit" class="btn mt-6"> Log in </button>
      <div class="divider" />
      <p class="text-center">
        Don't have an account? <a href="/register" class=" underline font-bold">
          Sign up
        </a>
      </p>
    </div>
  </form>
</div>
