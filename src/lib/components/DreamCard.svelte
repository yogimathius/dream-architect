<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Dream } from '$lib/data/dreams';

	export let dream: Dream;

	function navigateToDream() {
		goto(`/event/${dream.id}`);
	}
</script>

<div
	class="bg-opacity-40 mb-4 cursor-pointer rounded-lg border border-indigo-700 bg-indigo-800 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-indigo-700"
	on:click={navigateToDream}
	on:keydown={(e) => e.key === 'Enter' && navigateToDream()}
	tabindex="0"
	role="button"
	aria-label="Go to dream: {dream.title}"
>
	<h3 class="mb-2 text-2xl font-bold text-white">{dream.title}</h3>
	<p class="mb-4 line-clamp-2 text-indigo-200">{dream.description}</p>
	<div class="text-sm text-indigo-300">
		{dream.choices.length} Possible Paths...
	</div>
</div>
