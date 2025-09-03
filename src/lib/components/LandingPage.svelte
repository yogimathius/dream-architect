<script lang="ts">
	import { goto } from '$app/navigation';

	function enterDreamscape() {
		goto('/map');
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white"
>
	<h1 class="mb-8 text-center text-5xl font-bold">Enter the Dreamscape</h1>
	<p class="mb-12 max-w-md text-center text-xl">
		A journey through your subconscious awaits. Dive into the world of dreams.
	</p>
	<button
		on:click={enterDreamscape}
		class="rounded-lg bg-indigo-600 px-8 py-4 text-xl font-semibold shadow-lg transition-colors duration-300 hover:bg-indigo-700 hover:shadow-xl"
	>
		Enter Dreamscape
	</button>
</div>
