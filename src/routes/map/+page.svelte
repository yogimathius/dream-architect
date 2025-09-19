<script lang="ts">
	import { onMount } from 'svelte';
	import type { Dream } from '$lib/data/dreams';
	import PlayerMarker from '$lib/components/PlayerMarker.svelte';
	import DreamNode from '$lib/components/DreamNode.svelte';
	import DreamEventOverlay from '$lib/components/DreamEventOverlay.svelte';
	import DreamBackground from '$lib/components/DreamBackground.svelte';

	export let data: { dreams: Dream[] };

	// Player position and state
	let playerPosition = { x: 0, y: 0 };
	let isPlayerMoving = false;
	let activeDreamId: string | null = null;
	let selectedDream: Dream | null = null;

	// Map state
	let dreamNodes: { dream: Dream; position: { x: number; y: number } }[] = [];
	let mapContainer: HTMLDivElement;
	let mapReady = false;

	// Position generation function to create a circular layout
	function generatePositions(container: HTMLDivElement, numItems: number) {
		const positions: { x: number; y: number }[] = [];
		const centerX = container.clientWidth / 2;
		const centerY = container.clientHeight / 2;

		// Radius is 40% of the smaller dimension of the container
		const radius = Math.min(centerX, centerY) * 0.4;

		// Generate positions in a circle
		for (let i = 0; i < numItems; i++) {
			const angle = (2 * Math.PI * i) / numItems;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);
			positions.push({ x, y });
		}

		return positions;
	}

	// Handle dream node click
	function handleDreamNodeClick(id: string, position: { x: number; y: number }) {
		isPlayerMoving = true;
		activeDreamId = id;
		playerPosition = position;

		// Wait for the player to reach the node before showing the dream
		setTimeout(() => {
			isPlayerMoving = false;
			selectedDream = data.dreams.find((d) => d.id === id) || null;
		}, 1000);
	}

	// Close the dream overlay
	function closeDreamEvent() {
		selectedDream = null;
	}

	// Initialize map on mount
	onMount(() => {
		if (mapContainer) {
			const positions = generatePositions(mapContainer, data.dreams.length);

			// Create dream nodes
			dreamNodes = data.dreams.map((dream, i) => ({
				dream,
				position: positions[i]
			}));

			// Set initial player position to the center
			playerPosition = {
				x: mapContainer.clientWidth / 2,
				y: mapContainer.clientHeight / 2
			};

			// Mark map as ready
			setTimeout(() => {
				mapReady = true;
			}, 500);
		}

		// Handle window resize
		const handleResize = () => {
			if (mapContainer) {
				const positions = generatePositions(mapContainer, data.dreams.length);

				// Update node positions
				dreamNodes = dreamNodes.map((node, i) => ({
					...node,
					position: positions[i]
				}));

				// Reset player position if not on a dream node
				if (!activeDreamId) {
					playerPosition = {
						x: mapContainer.clientWidth / 2,
						y: mapContainer.clientHeight / 2
					};
				} else {
					// Move to the active dream's new position
					const activeDreamNode = dreamNodes.find((n) => n.dream.id === activeDreamId);
					if (activeDreamNode) {
						playerPosition = activeDreamNode.position;
					}
				}
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- Dreamy animated background -->
<DreamBackground />

<div class="relative min-h-screen w-full overflow-hidden">
	<div class="absolute top-0 left-0 right-0 z-10 p-4 text-center pointer-events-none">
		<h1 class="mb-2 text-4xl font-bold text-white">Dream World Map</h1>
		<p class="mb-8 text-indigo-200">Explore the dreamscape...</p>
	</div>

	<!-- Map container -->
	<div
		bind:this={mapContainer}
		class="relative flex min-h-screen w-full items-center justify-center"
	>
		<!-- Dream nodes -->
		{#if mapReady && dreamNodes.length > 0}
			{#each dreamNodes as { dream, position }, i}
				<DreamNode
					{dream}
					{position}
					index={i}
					isActive={activeDreamId === dream.id}
					onClick={handleDreamNodeClick}
				/>
			{/each}

			<!-- Player marker -->
			<PlayerMarker position={playerPosition} isMoving={isPlayerMoving} />
		{/if}
	</div>
</div>

<!-- Dream event overlay -->
{#if selectedDream}
	<DreamEventOverlay dream={selectedDream} onClose={closeDreamEvent} />
{/if}
