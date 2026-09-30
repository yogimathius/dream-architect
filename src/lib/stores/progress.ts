import type { Dream } from '$lib/data/dreams';

export const PROGRESS_STORAGE_KEY = 'dream-architect-progress';

/** Pure: returns a fresh dream list with every id in `unlockedIds` marked unlocked. */
export function applyUnlockedIds(dreams: Dream[], unlockedIds: string[]): Dream[] {
	const unlockedSet = new Set(unlockedIds);
	return dreams.map((dream) => (unlockedSet.has(dream.id) ? { ...dream, locked: false } : dream));
}

/** Pure: the list of currently-unlocked dream ids, for saving. */
export function collectUnlockedIds(dreams: Dream[]): string[] {
	return dreams.filter((dream) => !dream.locked).map((dream) => dream.id);
}
