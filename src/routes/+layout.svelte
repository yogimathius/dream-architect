<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';

	let { children } = $props();

	onMount(() => {
		// Side-effecting import: PerformanceMonitor's constructor wires up its
		// Web Vitals observers on instantiation and only runs client-side.
		import('$lib/utils/performance');
	});
</script>

<ErrorBoundary>
	{@render children()}
</ErrorBoundary>
