<script lang="ts">
	import type { Choice } from '$lib/data/dreams';
	export let choice: Choice;
</script>

<button
	class="mb-3 w-full rounded-md bg-indigo-700 px-6 py-4 text-left font-medium text-white transition-colors duration-300 hover:bg-indigo-600"
>
	{choice.text}
</button>
