<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DreamNode from './DreamNode.svelte';
	import PlayerMarker from './PlayerMarker.svelte';
	import type { Dream } from '$lib/data/dreams';
	import { fade } from 'svelte/transition';
	import { gsap } from 'gsap';
	import {
		dreamStore,
		unlockedDreams,
		activeDreamId,
		activeDream,
		playerPosition,
		isPlayerMoving,
		recentlyUnlockedDreams,
		movePlayerToPosition,
		handleDreamNodeClick
	} from '$lib/stores/dreamStore';

	// Node positions on the map
	const nodePositions = [
		{ x: 150, y: 150 }, // Forest (1)
		{ x: 300, y: 120 }, // Caverns (2)
		{ x: 450, y: 180 }, // Islands (3)
		{ x: 350, y: 300 }, // Clock Tower (4)
		{ x: 200, y: 280 } // Stars (5)
	];

	// Map view
	let mapContainer: HTMLDivElement;
	let mapWidth = 600;
	let mapHeight = 400;
	let mapScale = 1;
	let isMapReady = false;

	// Particles
	let particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
	const MAX_PARTICLES = 50;
	let particleCanvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrameId: number;

	// Initialize particles
	function initParticles() {
		particles = [];
		for (let i = 0; i < MAX_PARTICLES; i++) {
			particles.push({
				x: Math.random() * mapWidth,
				y: Math.random() * mapHeight,
				size: Math.random() * 2 + 1,
				speed: Math.random() * 0.5 + 0.1,
				opacity: Math.random() * 0.5 + 0.1
			});
		}
	}

	// Animate particles
	function animateParticles() {
		if (!ctx || !particleCanvas) return;

		ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
		ctx.fillStyle = 'white';

		particles.forEach((particle) => {
			particle.y -= particle.speed;
			if (particle.y < 0) {
				particle.y = mapHeight;
				particle.x = Math.random() * mapWidth;
			}

			if (ctx) {
				ctx.globalAlpha = particle.opacity;
				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fill();
			}
		});

		animationFrameId = requestAnimationFrame(animateParticles);
	}

	// Handle dream node click
	function handleNodeClick(dreamId: string, position: { x: number; y: number }) {
		const dream = $dreamStore.find((d) => d.id === dreamId);
		if (dream) {
			handleDreamNodeClick(dream, position);
		}
	}

	// Resize handler
	function handleResize() {
		if (!mapContainer) return;

		const boundingRect = mapContainer.getBoundingClientRect();
		mapWidth = boundingRect.width;
		mapHeight = boundingRect.height;

		if (particleCanvas) {
			particleCanvas.width = mapWidth;
			particleCanvas.height = mapHeight;
		}
	}

	// Lifecycle
	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);

		// Initialize particle canvas
		if (particleCanvas) {
			ctx = particleCanvas.getContext('2d');
			particleCanvas.width = mapWidth;
			particleCanvas.height = mapHeight;

			initParticles();
			animateParticles();
		}

		// Set initial player position to the first unlocked dream
		$unlockedDreams.forEach((dream, index) => {
			if (index === 0) {
				const pos = nodePositions[parseInt(dream.id, 10) - 1] || {
					x: mapWidth / 2,
					y: mapHeight / 2
				};
				// Set initial position
				movePlayerToPosition(pos);
			}
		});

		// Initialize map
		setTimeout(() => {
			isMapReady = true;

			// Apply intro animation to the map
			gsap.from(mapContainer, {
				scale: 0.8,
				opacity: 0,
				duration: 1,
				ease: 'power3.out'
			});
		}, 300);
	});

	onDestroy(() => {
		window.removeEventListener('resize', handleResize);
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
	});
</script>

<div
	bind:this={mapContainer}
	class="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900"
>
	{#if isMapReady}
		<div in:fade={{ duration: 500 }} class="dream-map absolute inset-0">
			<!-- Particle background -->
			<canvas bind:this={particleCanvas} class="absolute inset-0"></canvas>

			<!-- Connection lines between nodes -->
			<svg class="pointer-events-none absolute inset-0 h-full w-full">
				<!-- Line from Forest to Caverns -->
				<line
					x1={nodePositions[0].x}
					y1={nodePositions[0].y}
					x2={nodePositions[1].x}
					y2={nodePositions[1].y}
					class="connection-line"
				/>

				<!-- Line from Caverns to Islands -->
				<line
					x1={nodePositions[1].x}
					y1={nodePositions[1].y}
					x2={nodePositions[2].x}
					y2={nodePositions[2].y}
					class="connection-line"
				/>

				<!-- Line from Islands to Clock Tower -->
				<line
					x1={nodePositions[2].x}
					y1={nodePositions[2].y}
					x2={nodePositions[3].x}
					y2={nodePositions[3].y}
					class="connection-line"
				/>

				<!-- Line from Clock Tower to Stars -->
				<line
					x1={nodePositions[3].x}
					y1={nodePositions[3].y}
					x2={nodePositions[4].x}
					y2={nodePositions[4].y}
					class="connection-line"
				/>
			</svg>

			<!-- Dream nodes -->
			{#each $dreamStore as dream, i}
				{@const position = nodePositions[parseInt(dream.id, 10) - 1] || { x: 0, y: 0 }}
				{@const isActive = $activeDreamId === dream.id}
				{@const isRecentlyUnlocked = $recentlyUnlockedDreams.includes(dream.id)}

				<DreamNode
					{dream}
					{position}
					index={i}
					{isActive}
					{isRecentlyUnlocked}
					onClick={handleNodeClick}
				/>
			{/each}

			<!-- Player marker -->
			<PlayerMarker position={$playerPosition} isMoving={$isPlayerMoving} />
		</div>
	{/if}
</div>

<style>
	.connection-line {
		stroke: rgba(255, 255, 255, 0.2);
		stroke-width: 2;
		stroke-dasharray: 5, 5;
	}
</style>
