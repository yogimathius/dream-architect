<script lang="ts">
	import ChoiceButton from '$lib/components/ChoiceButton.svelte';
	import { goto } from '$app/navigation';
	import type { Dream } from '$lib/data/dreams';

	export let data: { dream: Dream | undefined };

	function goBack() {
		goto('/map');
	}
</script>

{#if data.dream}
	<div class="min-h-screen bg-gradient-to-b from-indigo-900 to-black p-6">
		<div class="mx-auto max-w-2xl">
			<button
				on:click={goBack}
				class="mb-8 flex items-center text-indigo-300 transition-colors hover:text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Back to Map
			</button>

			<h1 class="mb-4 text-4xl font-bold text-white">{data.dream.title}</h1>
			<p class="mb-8 text-lg text-indigo-200">{data.dream.description}</p>

			<h2 class="mb-4 text-2xl font-semibold text-white">What will you do?</h2>
			<div class="space-y-2">
				{#each data.dream.choices as choice}
					<ChoiceButton {choice} />
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div
		class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black p-6"
	>
		<h1 class="mb-4 text-4xl font-bold text-white">Dream Not Found</h1>
		<p class="mb-8 text-indigo-200">This dream doesn't exist or has faded away.</p>
		<button
			on:click={goBack}
			class="rounded-md bg-indigo-700 px-6 py-3 text-white transition-colors hover:bg-indigo-600"
		>
			Return to Map
		</button>
	</div>
{/if}
