<script lang="ts">
	import { dev } from '$app/environment';

	export let fallback: boolean = true;

	let errorMessage = '';
	let errorStack = '';

	function handleError(error: unknown) {
		const err = error instanceof Error ? error : new Error(String(error));
		console.error('Svelte Error Boundary caught an error:', err);

		errorMessage = err.message || 'An unexpected error occurred';
		errorStack = err.stack || '';

		// Log to error reporting service in production
		if (!dev) {
			// Example: Send to Sentry, LogRocket, etc.
			console.error('Production error captured:', {
				message: errorMessage,
				stack: errorStack,
				timestamp: new Date().toISOString(),
				userAgent: navigator.userAgent,
				url: window.location.href
			});
		}
	}

	function handleReload() {
		window.location.reload();
	}
</script>

<svelte:boundary onerror={(error) => handleError(error)}>
	<slot />

	{#snippet failed(_error, reset)}
		{#if fallback}
			<div
				class="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50"
			>
				<div class="w-full max-w-md text-center">
					<div class="rounded-lg bg-white p-8 shadow-lg">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
						>
							<svg
								class="h-8 w-8 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>

						<h1 class="mb-4 text-2xl font-bold text-gray-900">Something went wrong</h1>

						<p class="mb-6 text-gray-600">
							We encountered an unexpected error. Please try refreshing the page or contact
							support if the problem persists.
						</p>

						{#if dev && errorMessage}
							<div class="mb-6 rounded-lg bg-gray-100 p-4 text-left">
								<p class="mb-2 font-mono text-sm text-gray-800">
									{errorMessage}
								</p>
								{#if errorStack}
									<details>
										<summary class="cursor-pointer text-sm text-gray-600">Stack trace</summary>
										<pre class="mt-2 max-h-32 overflow-auto text-xs text-gray-700">{errorStack}</pre>
									</details>
								{/if}
							</div>
						{/if}

						<div class="flex justify-center gap-3">
							<button
								on:click={() => reset()}
								class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Try Again
							</button>
							<button
								on:click={handleReload}
								class="rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							>
								Refresh Page
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Silent error mode - just log the error -->
			<div class="error-boundary-silent"></div>
		{/if}
	{/snippet}
</svelte:boundary>
