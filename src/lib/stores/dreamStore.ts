import { writable, get, derived } from 'svelte/store';
import { dreams as initialDreams } from '$lib/data/dreams';
import type { Dream } from '$lib/data/dreams';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import { PROGRESS_STORAGE_KEY, applyUnlockedIds, collectUnlockedIds } from './progress';

// Progress previously reset on every page reload — nothing wrote unlocked-dream state anywhere.
// Restore from localStorage on load (browser only; SSR/tests get the fresh, all-default data).
function loadInitialDreams(): Dream[] {
	if (typeof localStorage === 'undefined') return initialDreams;
	try {
		const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
		if (!raw) return initialDreams;
		const unlockedIds: unknown = JSON.parse(raw);
		if (!Array.isArray(unlockedIds)) return initialDreams;
		return applyUnlockedIds(initialDreams, unlockedIds as string[]);
	} catch {
		return initialDreams;
	}
}

// Create a writable store with the initial dreams data
export const dreamStore = writable<Dream[]>(loadInitialDreams());

if (typeof localStorage !== 'undefined') {
	dreamStore.subscribe((dreams) => {
		localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(collectUnlockedIds(dreams)));
	});
}

// Create a store for the active dream (currently being viewed)
export const activeDreamId = writable<string | null>(null);

// Create a store for keeping track of recently unlocked dreams (for animations)
export const recentlyUnlockedDreams = writable<string[]>([]);

// Create a store for the player's position
export const playerPosition = tweened(
	{ x: 0, y: 0 },
	{
		duration: 800,
		easing: cubicOut
	}
);

// Create a store to track if the player is moving
export const isPlayerMoving = writable(false);

// Derived store to get all unlocked dreams
export const unlockedDreams = derived(dreamStore, ($dreams) =>
	$dreams.filter((dream) => !dream.locked)
);

// Derived store to get the active dream
export const activeDream = derived([dreamStore, activeDreamId], ([$dreams, $activeDreamId]) =>
	$activeDreamId ? $dreams.find((d) => d.id === $activeDreamId) || null : null
);

// Function to unlock a dream by ID
export function unlockDream(dreamId: string): void {
	dreamStore.update((dreams) => {
		const updatedDreams = dreams.map((dream) => {
			if (dream.id === dreamId && dream.locked) {
				// Add to recently unlocked for animation
				recentlyUnlockedDreams.update((ids) => [...ids, dreamId]);

				// Return unlocked dream
				return { ...dream, locked: false };
			}
			return dream;
		});
		return updatedDreams;
	});
}

// Function to handle a choice selection
export function handleChoice(dreamId: string, choiceIndex: number): void {
	const dreams = get(dreamStore);
	const dream = dreams.find((d) => d.id === dreamId);

	if (!dream) return;

	const choice = dream.choices[choiceIndex];
	if (!choice) return;

	// Unlock any dreams specified by this choice
	choice.unlocks.forEach((unlockId) => {
		unlockDream(unlockId);
	});

	// Close the active dream view after making a choice
	activeDreamId.set(null);
}

// Function to move player to a specific position
export function movePlayerToPosition(position: { x: number; y: number }): Promise<void> {
	isPlayerMoving.set(true);

	return new Promise((resolve) => {
		// Update player position with animation
		playerPosition.set(position).then(() => {
			isPlayerMoving.set(false);
			resolve();
		});
	});
}

// Function to handle dream node click
export function handleDreamNodeClick(dream: Dream, position: { x: number; y: number }): void {
	if (dream.locked) return;

	// Move player to the dream position
	movePlayerToPosition(position).then(() => {
		// After reaching the dream, set it as active
		activeDreamId.set(dream.id);

		// Store the position with the dream for future reference
		dreamStore.update((dreams) => dreams.map((d) => (d.id === dream.id ? { ...d, position } : d)));
	});
}

// Clear a dream from recently unlocked after animating it
export function clearRecentlyUnlocked(dreamId: string): void {
	recentlyUnlockedDreams.update((ids) => ids.filter((id) => id !== dreamId));
}
