<script lang="ts">
	import { onErrorCaptured } from 'svelte';
	import { dev } from '$app/environment';
	
	export let fallback: boolean = true;
	
	let hasError = false;
	let errorMessage = '';
	let errorStack = '';
	
	// Handle errors in child components
	onErrorCaptured((error, errorInfo) => {
		console.error('Svelte Error Boundary caught an error:', error, errorInfo);
		
		hasError = true;
		errorMessage = error.message || 'An unexpected error occurred';
		errorStack = error.stack || '';
		
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
		
		return false; // Prevent error from bubbling up
	});
	
	function handleRetry() {
		hasError = false;
		errorMessage = '';
		errorStack = '';
	}
	
	function handleReload() {
		window.location.reload();
	}
</script>

{#if hasError && fallback}
	<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
		<div class="max-w-md w-full text-center">
			<div class="bg-white rounded-lg shadow-lg p-8">
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L4.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				
				<h1 class="text-2xl font-bold text-gray-900 mb-4">
					Something went wrong
				</h1>
				
				<p class="text-gray-600 mb-6">
					We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
				</p>
				
				{#if dev && errorMessage}
					<div class="bg-gray-100 rounded-lg p-4 mb-6 text-left">
						<p class="text-sm font-mono text-gray-800 mb-2">
							{errorMessage}
						</p>
						{#if errorStack}
							<details>
								<summary class="text-sm text-gray-600 cursor-pointer">Stack trace</summary>
								<pre class="text-xs text-gray-700 mt-2 overflow-auto max-h-32">{errorStack}</pre>
							</details>
						{/if}
					</div>
				{/if}
				
				<div class="flex gap-3 justify-center">
					<button
						on:click={handleRetry}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
					>
						Try Again
					</button>
					<button
						on:click={handleReload}
						class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
					>
						Refresh Page
					</button>
				</div>
			</div>
		</div>
	</div>
{:else if hasError}
	<!-- Silent error mode - just log the error -->
	<div class="error-boundary-silent" />
{:else}
	<slot />
{/if}