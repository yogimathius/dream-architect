import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
	dreamStore,
	activeDreamId,
	recentlyUnlockedDreams,
	unlockedDreams,
	activeDream,
	unlockDream,
	handleChoice,
	movePlayerToPosition,
	handleDreamNodeClick,
	clearRecentlyUnlocked
} from './dreamStore';
import type { Dream } from '$lib/data/dreams';

// Mock tweened
vi.mock('svelte/motion', () => {
	return {
		tweened: () => ({
			subscribe: vi.fn((callback) => {
				callback({ x: 0, y: 0 });
				return { unsubscribe: vi.fn() };
			}),
			set: vi.fn(() => Promise.resolve()),
			update: vi.fn()
		})
	};
});

describe('dreamStore', () => {
	beforeEach(() => {
		// Reset store to initial state
		dreamStore.set([
			{
				id: '1',
				title: 'Test Dream 1',
				description: 'Description 1',
				locked: false,
				choices: [
					{
						text: 'Choice 1',
						unlocks: ['2']
					}
				]
			},
			{
				id: '2',
				title: 'Test Dream 2',
				description: 'Description 2',
				locked: true,
				choices: [
					{
						text: 'Choice 1',
						unlocks: []
					}
				]
			}
		]);
		activeDreamId.set(null);
		recentlyUnlockedDreams.set([]);
	});

	it('should initialize with correct dream data', () => {
		const dreams = get(dreamStore);
		expect(dreams).toHaveLength(2);
		expect(dreams[0].id).toBe('1');
		expect(dreams[0].locked).toBe(false);
		expect(dreams[1].id).toBe('2');
		expect(dreams[1].locked).toBe(true);
	});

	it('should properly derive unlocked dreams', () => {
		const unlocked = get(unlockedDreams);
		expect(unlocked).toHaveLength(1);
		expect(unlocked[0].id).toBe('1');
	});

	it('should return the active dream when activeDreamId is set', () => {
		// Initially no active dream
		expect(get(activeDream)).toBeNull();

		// Set active dream
		activeDreamId.set('1');
		expect(get(activeDream)?.id).toBe('1');

		// Set to non-existent dream
		activeDreamId.set('999');
		expect(get(activeDream)).toBeNull();
	});

	it('should unlock a dream', () => {
		unlockDream('2');

		// Check that the dream is unlocked
		const dreams = get(dreamStore);
		expect(dreams[1].locked).toBe(false);

		// Check that it was added to recently unlocked
		const recently = get(recentlyUnlockedDreams);
		expect(recently).toContain('2');
	});

	it('should handle choice selection and unlock new dreams', () => {
		handleChoice('1', 0);

		// Check that dream 2 is unlocked
		const dreams = get(dreamStore);
		expect(dreams[1].locked).toBe(false);

		// Check that active dream is cleared
		expect(get(activeDreamId)).toBeNull();
	});

	it('should clear a dream from recently unlocked', () => {
		// First unlock a dream
		unlockDream('2');
		expect(get(recentlyUnlockedDreams)).toContain('2');

		// Then clear it
		clearRecentlyUnlocked('2');
		expect(get(recentlyUnlockedDreams)).not.toContain('2');
	});
});
