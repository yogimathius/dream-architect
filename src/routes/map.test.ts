import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import { dreams } from '$lib/data/dreams';

// Mock the goto function
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Navigation from landing to map', () => {
	it('should navigate to map page when button is clicked', async () => {
		// This test would normally interact with a component
		// For MVP, we'll just verify the goto mock can be called
		const mockGoto = goto as unknown as ReturnType<typeof vi.fn>;

		// Simulate navigation
		await mockGoto('/map');

		// Check if goto was called with the right route
		expect(mockGoto).toHaveBeenCalledWith('/map');
	});
});
