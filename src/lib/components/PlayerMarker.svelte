<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	export let position = { x: 0, y: 0 };
	export let isMoving = false;

	let markerElement: HTMLDivElement;
	let glowElement: HTMLDivElement;

	// Update marker position
	$: if (markerElement && position) {
		gsap.to(markerElement, {
			duration: isMoving ? 0.7 : 0.1,
			ease: isMoving ? 'power2.out' : 'none',
			x: position.x,
			y: position.y
		});
	}

	// Update glow animation
	$: if (glowElement && markerElement) {
		if (isMoving) {
			// Intensify the glow when moving
			gsap.to(glowElement, {
				scale: 1.5,
				opacity: 0.8,
				duration: 0.5
			});
		} else {
			// Return to normal glow
			gsap.to(glowElement, {
				scale: 1,
				opacity: 0.5,
				duration: 0.5
			});
		}
	}

	// Initialize animations
	onMount(() => {
		// Create idle hover animation
		gsap.to(markerElement, {
			y: '+=3',
			duration: 1,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		// Create pulsing glow animation
		gsap.to(glowElement, {
			scale: 1.2,
			opacity: 0.3,
			duration: 1.5,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});
	});
</script>

<div
	bind:this={markerElement}
	class="player-marker absolute"
	style="transform: translate({position.x}px, {position.y}px)"
	aria-label="Player location"
>
	<!-- Glow effect -->
	<div bind:this={glowElement} class="glow absolute"></div>

	<!-- Player icon -->
	<div class="marker z-10">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="4" />
		</svg>
	</div>
</div>

<style>
	.player-marker {
		transform-origin: center;
		pointer-events: none;
		width: 24px;
		height: 24px;
		margin-left: -12px;
		margin-top: -12px;
		z-index: 20;
		filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
	}

	.marker {
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.glow {
		inset: -50%;
		background: radial-gradient(circle, rgba(100, 200, 255, 0.7) 0%, rgba(100, 200, 255, 0) 70%);
		opacity: 0.5;
		border-radius: 50%;
		z-index: 0;
		transform-origin: center;
	}
</style>
