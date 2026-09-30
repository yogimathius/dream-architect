<script lang="ts">
	export let explored: number;
	export let total: number;

	$: percent = total > 0 ? Math.min(100, Math.round((explored / total) * 100)) : 0;
	$: isComplete = total > 0 && explored >= total;
</script>

<div class="mx-auto w-full max-w-xs rounded-full bg-black/30 px-4 py-2 backdrop-blur-sm">
	<div class="mb-1.5 flex items-center justify-between text-xs text-indigo-200">
		<span>{explored} / {total} dreams explored</span>
	</div>
	<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
		<div
			data-testid="dream-progress-fill"
			class="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-[width] duration-500 ease-out"
			style:width="{percent}%"
		></div>
	</div>
</div>

{#if isComplete}
	<p class="mt-2 text-center text-sm text-indigo-200">
		You've explored every corner of your dreamscape.
	</p>
{/if}
