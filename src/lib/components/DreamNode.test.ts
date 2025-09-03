import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import DreamNode from './DreamNode.svelte';
import type { Dream, Choice } from '$lib/data/dreams';

// Mock GSAP
vi.mock('gsap', () => ({
	gsap: {
		from: vi.fn(),
		to: vi.fn(),
		set: vi.fn(),
		timeline: vi.fn(() => ({
			to: vi.fn().mockReturnThis(),
			call: vi.fn().mockReturnThis()
		}))
	}
}));

describe('DreamNode Component', () => {
	const mockDream: Dream = {
		id: '1',
		title: 'Test Dream',
		description: 'Test description',
		locked: false,
		choices: [
			{
				text: 'Choice 1',
				unlocks: []
			},
			{
				text: 'Choice 2',
				unlocks: []
			}
		]
	};

	const mockPosition = { x: 100, y: 100 };
	const mockIndex = 0;
	const mockOnClick = vi.fn();

	it('renders correctly when visible', async () => {
		// Arrange
		render(DreamNode, {
			dream: mockDream,
			position: mockPosition,
			index: mockIndex,
			isActive: false,
			onClick: mockOnClick
		});

		// We need to wait for the node to become visible
		await new Promise((resolve) => setTimeout(resolve, 200));

		// Assert - should have the right aria-label
		const nodeElement = screen.getByRole('button', { name: /Dream node: Test Dream/i });
		expect(nodeElement).toBeDefined();
	});

	it('calls onClick when clicked', async () => {
		// Arrange
		render(DreamNode, {
			dream: mockDream,
			position: mockPosition,
			index: mockIndex,
			isActive: false,
			onClick: mockOnClick
		});

		// We need to wait for the node to become visible
		await new Promise((resolve) => setTimeout(resolve, 200));

		// Act - find and click the node
		const nodeElement = screen.getByRole('button', { name: /Dream node: Test Dream/i });
		await fireEvent.click(nodeElement);

		// Assert
		expect(mockOnClick).toHaveBeenCalledWith('1', mockPosition);
	});
});
