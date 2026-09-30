<script lang="ts">
	// Test-only fixture: hosts ErrorBoundary around a child that always throws,
	// since @testing-library/svelte has no direct way to inject slot content.
	import ErrorBoundary from '../ErrorBoundary.svelte';
	import ThrowingChild from './ThrowingChild.svelte';

	export let fallback: boolean = true;
</script>

<ErrorBoundary {fallback}>
	<ThrowingChild />
</ErrorBoundary>
