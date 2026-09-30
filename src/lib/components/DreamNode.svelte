<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import type { Dream } from '$lib/data/dreams';
	import { gsap } from 'gsap';
	import { recentlyUnlockedDreams, clearRecentlyUnlocked } from '$lib/stores/dreamStore';

	export let dream: Dream;
	export let position: { x: number; y: number };
	export let index: number;
	export let isActive: boolean = false;
	export let onClick: (id: string, position: { x: number; y: number }) => void;
	export let isRecentlyUnlocked: boolean = false;

	let nodeElement: HTMLDivElement;
	let isVisible = false;
	let pulseAnimation: gsap.core.Tween | null = null;
	let unlockAnimation: gsap.core.Timeline | null = null;
	let hoverActive = false;
	let hasPlayedUnlockAnimation = false;

	// Different colors for each node type
	const colors = [
		'from-indigo-500 to-purple-500', // Forest
		'from-cyan-400 to-blue-500', // Caverns
		'from-sky-400 to-indigo-400', // Islands
		'from-amber-400 to-red-500', // Clock Tower
		'from-violet-500 to-fuchsia-500' // Stars
	];

	const getNodeColor = (id: string) => {
		const numId = parseInt(id, 10);
		return colors[(numId - 1) % colors.length];
	};

	function handleClick() {
		if (dream.locked) return;

		// Get the center position of the node for the player to move to
		if (nodeElement) {
			const rect = nodeElement.getBoundingClientRect();
			const centerX = position.x;
			const centerY = position.y;
			onClick(dream.id, { x: centerX, y: centerY });
		}
	}

	function handleMouseEnter() {
		if (dream.locked) return;
		hoverActive = true;

		// Add hover effect with GSAP
		if (nodeElement && !isActive) {
			gsap.to(nodeElement.querySelector('.node-circle'), {
				scale: 1.15,
				boxShadow: '0 0 20px rgba(255, 255, 255, 0.7)',
				duration: 0.3
			});
		}
	}

	function handleMouseLeave() {
		hoverActive = false;

		// Remove hover effect
		if (nodeElement && !isActive) {
			gsap.to(nodeElement.querySelector('.node-circle'), {
				scale: 1,
				boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
				duration: 0.3
			});
		}
	}

	function startPulseAnimation() {
		if (nodeElement && !dream.locked) {
			// Create subtle pulse animation for unlocked dreams
			pulseAnimation = gsap.to(nodeElement.querySelector('.node-circle'), {
				boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
				scale: 1.05,
				duration: 1.5,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});
		}
	}

	function createUnlockAnimation() {
		if (nodeElement && isRecentlyUnlocked) {
			// Create an impressive unlock animation
			unlockAnimation = gsap.timeline();

			// Reset any existing animations
			gsap.set(nodeElement, { scale: 0, opacity: 0 });
			gsap.set(nodeElement.querySelector('.node-circle'), { scale: 0 });

			// Create the reveal animation
			unlockAnimation
				.to(nodeElement, {
					scale: 1,
					opacity: 1,
					duration: 0.6,
					ease: 'back.out(1.7)'
				})
				.to(
					nodeElement.querySelector('.node-circle'),
					{
						scale: 1,
						duration: 0.5,
						ease: 'back.out(2)'
					},
					'-=0.3'
				)
				.to(
					nodeElement.querySelector('.node-circle'),
					{
						boxShadow: '0 0 30px rgba(255, 255, 255, 0.9)',
						duration: 0.4
					},
					'-=0.2'
				)
				.to(nodeElement.querySelector('.node-circle'), {
					boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
					duration: 0.6
				})
				.call(() => {
					// Clear this dream from the recently unlocked list
					clearRecentlyUnlocked(dream.id);
					// Start the regular pulse animation
					startPulseAnimation();
				});
		}
	}

	// Lifecycle
	onMount(() => {
		// Stagger the appearance of existing nodes
		setTimeout(() => {
			isVisible = true;

			// The reveal animation for an already-unlocked node is handled by the
			// `isRecentlyUnlocked` reactive block below (it also covers a node unlocking
			// later, mid-session, which is the common case this component needs to support).
			if (nodeElement && !isRecentlyUnlocked) {
				// Normal node appearance
				gsap.from(nodeElement, {
					scale: 0.5,
					opacity: 0,
					duration: 0.7,
					delay: index * 0.15,
					ease: 'back.out(1.7)',
					onComplete: () => {
						if (!dream.locked) {
							startPulseAnimation();
						}
					}
				});
			}
		}, 100);
	});

	onDestroy(() => {
		// Clean up animations
		if (pulseAnimation) pulseAnimation.kill();
		if (unlockAnimation) unlockAnimation.kill();
	});

	// Play the reveal animation whenever this node newly becomes unlocked, not just when it
	// happens to already be unlocked at initial mount (the common case: a dream unlocks mid-
	// session, well after its DreamNode instance was created).
	$: if (isRecentlyUnlocked && nodeElement && isVisible && !hasPlayedUnlockAnimation) {
		hasPlayedUnlockAnimation = true;
		createUnlockAnimation();
	}
	$: if (!isRecentlyUnlocked) {
		hasPlayedUnlockAnimation = false;
	}

	// Active state
	$: if (isActive && nodeElement && !hoverActive) {
		gsap.to(nodeElement.querySelector('.node-circle'), {
			scale: 1.15,
			boxShadow: '0 0 20px rgba(255, 255, 255, 0.7)',
			duration: 0.3
		});
	} else if (!isActive && nodeElement && !hoverActive) {
		gsap.to(nodeElement.querySelector('.node-circle'), {
			scale: 1,
			boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
			duration: 0.3
		});
	}
</script>

{#if isVisible}
	<div
		bind:this={nodeElement}
		class="dream-node relative"
		on:click={handleClick}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		on:keydown={(e) => e.key === 'Enter' && handleClick()}
		tabindex="0"
		role="button"
		aria-label="Dream node: {dream.title}{dream.locked ? ' (locked)' : ''}"
		style="left: {position.x}px; top: {position.y}px;"
	>
		<!-- Node background with glow -->
		<div
			class="node-circle absolute h-16 w-16 cursor-pointer rounded-full bg-gradient-to-br {getNodeColor(
				dream.id
			)} p-1 shadow-lg transition-transform duration-300"
			class:ring-4={isActive}
			class:ring-white={isActive}
			class:opacity-30={dream.locked}
			class:cursor-default={dream.locked}
			class:grayscale={dream.locked}
		>
			<!-- Inner circle -->
			<div
				class="bg-opacity-30 flex h-full w-full items-center justify-center rounded-full bg-black backdrop-blur-sm"
			>
				<!-- Icon based on dream type (simplified) -->
				{#if dream.id === '1'}
					<!-- Forest -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M7 3.5A1.5 1.5 0 018.5 2h3A1.5 1.5 0 0113 3.5V5h1.5a1.5 1.5 0 011.5 1.5V8h1.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5H15v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 15.5V14H7.5A1.5 1.5 0 016 12.5v-3A1.5 1.5 0 017.5 8H9V6.5A1.5 1.5 0 017.5 5H6V3.5A1.5 1.5 0 017 3.5z"
						/>
					</svg>
				{:else if dream.id === '2'}
					<!-- Caverns -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
						/>
					</svg>
				{:else if dream.id === '3'}
					<!-- Floating Islands -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707.707-.707A1 1 0 0116 3v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 01-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else if dream.id === '4'}
					<!-- Clock Tower -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<!-- Stars -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
						/>
					</svg>
				{/if}
			</div>
		</div>

		<!-- Lock icon overlay for locked dreams -->
		{#if dream.locked}
			<div class="absolute inset-0 flex items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-100 opacity-70"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			</div>
		{/if}

		<!-- Dream title tooltip -->
		<div
			class="bg-opacity-70 absolute top-full left-1/2 mt-2 w-max -translate-x-1/2 rounded-md bg-black px-3 py-1 text-center text-sm text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
			class:opacity-100={isActive}
		>
			{dream.title}
			{#if dream.locked}<span class="ml-1 text-gray-400">(Locked)</span>{/if}
		</div>
	</div>
{/if}

<style>
	.dream-node {
		position: absolute;
		transform: translate(-50%, -50%);
	}
</style>
