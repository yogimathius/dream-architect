import { describe, it, expect } from 'vitest';
import { dreams } from './dreams';

describe('Dream data', () => {
	it('should have 5 dreams', () => {
		expect(dreams.length).toBe(5);
	});

	it('each dream should have the required properties', () => {
		dreams.forEach((dream) => {
			expect(dream).toHaveProperty('id');
			expect(dream).toHaveProperty('title');
			expect(dream).toHaveProperty('description');
			expect(dream).toHaveProperty('choices');
			expect(Array.isArray(dream.choices)).toBe(true);
			expect(dream.choices.length).toBeGreaterThan(0);
		});
	});

	it('each dream should have a unique id', () => {
		const ids = dreams.map((dream) => dream.id);
		const uniqueIds = [...new Set(ids)];
		expect(uniqueIds.length).toBe(dreams.length);
	});
});
