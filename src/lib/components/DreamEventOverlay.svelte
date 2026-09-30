<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import ChoiceButton from './ChoiceButton.svelte';
	import type { Dream, Choice } from '$lib/data/dreams';
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';

	export let dream: Dream | null = null;
	export let onClose: () => void;
	export let onChoiceSelected: (choice: Choice) => void = () => {};

	let mainContent: HTMLDivElement;
	let backgroundEl: HTMLDivElement;

	onMount(() => {
		if (backgroundEl && mainContent) {
			// Animate background
			gsap.fromTo(backgroundEl, { opacity: 0 }, { opacity: 1, duration: 0.5 });

			// Animate content
			gsap.fromTo(
				mainContent,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'back.out(1.4)' }
			);

			// Focus on main content for keyboard navigation
			mainContent.focus();
		}
	});

	function handleChoice(choice: Choice) {
		onChoiceSelected(choice);
		onClose();
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleContentClick(e: MouseEvent) {
		e.stopPropagation();
	}
</script>

{#if dream}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto p-4"
		on:click|self={onClose}
		on:keydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="dream-title"
		tabindex="-1"
		transition:fade={{ duration: 300 }}
	>
		<!-- Overlay background with parallax -->
		<div bind:this={backgroundEl} class="bg-opacity-70 absolute inset-0 bg-black backdrop-blur-sm">
			<!-- Dreamy background elements -->
			<div class="stars-small"></div>
			<div class="stars-medium"></div>
			<div class="stars-large"></div>
		</div>

		<!-- Main content -->
		<div
			bind:this={mainContent}
			class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-gradient-to-b from-indigo-900 to-indigo-900/70 p-6 shadow-2xl backdrop-blur-lg"
			on:click={handleContentClick}
			on:keydown={(e) => e.stopPropagation()}
			role="document"
			tabindex="-1"
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 rounded-full bg-indigo-800 p-2 text-white transition-colors hover:bg-indigo-700"
				on:click={onClose}
				aria-label="Close dialog"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<!-- Dream content -->
			<h1 id="dream-title" class="mb-4 text-3xl font-bold text-white">{dream.title}</h1>
			<div class="mb-8 text-lg text-indigo-200">{dream.description}</div>

			<h2 class="mb-4 text-2xl font-semibold text-white">What will you do?</h2>
			<div class="space-y-3">
				{#each dream.choices as choice}
					<button
						class="w-full text-left"
						on:click={() => handleChoice(choice)}
						on:keydown={(e) => e.key === 'Enter' && handleChoice(choice)}
					>
						<ChoiceButton {choice} />
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.stars-small,
	.stars-medium,
	.stars-large {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		display: block;
		background-image:
			radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 5px),
			radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 4px),
			radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 8px);
		background-size:
			550px 550px,
			350px 350px,
			250px 250px;
		background-position:
			0 0,
			40px 60px,
			130px 270px;
		animation: twinkle 15s ease infinite alternate;
	}

	.stars-medium {
		background-size:
			700px 700px,
			400px 400px,
			300px 300px;
		background-position:
			50px 20px,
			200px 300px,
			300px 350px;
		animation-delay: 5s;
	}

	.stars-large {
		background-size:
			800px 800px,
			600px 600px,
			400px 400px;
		background-position:
			120px 90px,
			200px 250px,
			300px 100px;
		animation-delay: 10s;
	}

	@keyframes twinkle {
		0% {
			opacity: 0.65;
			background-position:
				0 0,
				40px 60px,
				130px 270px;
		}
		50% {
			opacity: 0.55;
		}
		100% {
			opacity: 0.75;
			background-position:
				40px 20px,
				80px 120px,
				170px 310px;
		}
	}
</style>
