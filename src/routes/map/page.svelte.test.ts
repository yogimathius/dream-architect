import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Page from './+page.svelte';
import { dreams } from '$lib/data/dreams';
import { recentlyUnlockedDreams } from '$lib/stores/dreamStore';

// Mock GSAP (DreamNode/DreamEventOverlay both animate with it; not relevant to this logic test).
vi.mock('gsap', () => ({
	gsap: {
		fromTo: vi.fn(),
		from: vi.fn(),
		to: vi.fn(),
		set: vi.fn(),
		timeline: vi.fn(() => ({
			to: vi.fn().mockReturnThis(),
			call: vi.fn().mockReturnThis(),
			kill: vi.fn()
		}))
	}
}));

describe('/map/+page.svelte', () => {
	beforeEach(() => {
		// This store is a module-level singleton shared with DreamNode/dreamStore.test.ts —
		// reset it so a dream unlocked in one test doesn't leak "recently unlocked" into another.
		recentlyUnlockedDreams.set([]);
	});

	it('unlocks a dream when a choice that unlocks it is selected', async () => {
		render(Page, { data: { dreams: structuredClone(dreams) } });

		// The map only renders its nodes once `mapReady` flips (500ms after mount), and each
		// node fades in independently shortly after — wait for all 5 before asserting on any one.
		await waitFor(() => expect(screen.getAllByRole('button')).toHaveLength(5), { timeout: 2000 });

		// "Crystal Caverns" (dream id '2') starts locked and isn't reachable yet.
		expect(
			screen.getByRole('button', { name: /Dream node: Crystal Caverns \(locked\)/i })
		).toBeTruthy();

		// Click the starting unlocked node; the player animates over for ~1s before the
		// dream event overlay appears.
		await fireEvent.click(screen.getByRole('button', { name: /Dream node: The Endless Forest/i }));
		await waitFor(() => expect(screen.getByText('What will you do?')).toBeTruthy(), {
			timeout: 2000
		});

		// This choice's `unlocks: ['2']` should unlock Crystal Caverns.
		await fireEvent.click(screen.getByText('Follow the sound of running water').closest('button')!);

		await waitFor(() =>
			expect(screen.getByRole('button', { name: /^Dream node: Crystal Caverns$/i })).toBeTruthy()
		);

		// The page marks the dream as "recently unlocked" in the shared store, which is what
		// drives DreamNode's reveal animation (a separate, more direct test covers that the
		// animation itself fires off this store — this just confirms the page writes to it).
		expect(get(recentlyUnlockedDreams)).toContain('2');
	});

	it('tracks exploration progress as dreams are opened', async () => {
		render(Page, { data: { dreams: structuredClone(dreams) } });

		await waitFor(() => expect(screen.getAllByRole('button')).toHaveLength(5), { timeout: 2000 });

		// Nothing has been opened yet.
		expect(screen.getByText('0 / 5 dreams explored')).toBeTruthy();

		// Opening the starting dream counts as exploring it, even before picking a choice.
		await fireEvent.click(screen.getByRole('button', { name: /Dream node: The Endless Forest/i }));
		await waitFor(() => expect(screen.getByText('What will you do?')).toBeTruthy(), {
			timeout: 2000
		});

		await waitFor(() => expect(screen.getByText('1 / 5 dreams explored')).toBeTruthy());

		// Closing and reopening the same dream shouldn't double-count it.
		await fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
		await fireEvent.click(screen.getByRole('button', { name: /Dream node: The Endless Forest/i }));
		await waitFor(() => expect(screen.getByText('What will you do?')).toBeTruthy(), {
			timeout: 2000
		});

		expect(screen.getByText('1 / 5 dreams explored')).toBeTruthy();
	});
});
