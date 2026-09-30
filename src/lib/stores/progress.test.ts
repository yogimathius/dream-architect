import { describe, it, expect } from 'vitest';
import { applyUnlockedIds, collectUnlockedIds } from './progress';
import type { Dream } from '$lib/data/dreams';

function makeDream(id: string, locked: boolean): Dream {
	return { id, title: `Dream ${id}`, description: '', locked, choices: [] };
}

describe('applyUnlockedIds', () => {
	it('unlocks dreams whose id is in the saved list', () => {
		const dreams = [makeDream('1', false), makeDream('2', true), makeDream('3', true)];
		const result = applyUnlockedIds(dreams, ['2']);
		expect(result.find((d) => d.id === '2')?.locked).toBe(false);
		expect(result.find((d) => d.id === '3')?.locked).toBe(true);
	});

	it('leaves dreams unchanged when their id is not in the saved list', () => {
		const dreams = [makeDream('1', false), makeDream('2', true)];
		const result = applyUnlockedIds(dreams, []);
		expect(result).toEqual(dreams);
	});

	it('does not mutate the input array', () => {
		const dreams = [makeDream('1', true)];
		applyUnlockedIds(dreams, ['1']);
		expect(dreams[0].locked).toBe(true);
	});
});

describe('collectUnlockedIds', () => {
	it('returns the ids of every unlocked dream', () => {
		const dreams = [makeDream('1', false), makeDream('2', true), makeDream('3', false)];
		expect(collectUnlockedIds(dreams)).toEqual(['1', '3']);
	});

	it('returns an empty array when nothing is unlocked', () => {
		expect(collectUnlockedIds([makeDream('1', true)])).toEqual([]);
	});
});
