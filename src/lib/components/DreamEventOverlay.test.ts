import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DreamEventOverlay from './DreamEventOverlay.svelte';
import type { Dream } from '$lib/data/dreams';

// Mock GSAP
vi.mock('gsap', () => ({
	gsap: {
		fromTo: vi.fn(),
		from: vi.fn(),
		to: vi.fn()
	}
}));

// Mock the ChoiceButton component
vi.mock('./ChoiceButton.svelte', () => ({
	default: vi.fn().mockImplementation(({ choice }) => ({
		render: () => {
			return {
				html: `<button>${choice.text}</button>`,
				$$: {
					capture: () => []
				},
				on_mount: []
			};
		}
	}))
}));

describe('DreamEventOverlay Component', () => {
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
				unlocks: ['2']
			}
		]
	};

	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders correctly with provided dream', () => {
		// Arrange & Act
		const { getByText } = render(DreamEventOverlay, {
			dream: mockDream,
			onClose: mockOnClose
		});

		// Assert
		expect(getByText('Test Dream')).toBeTruthy();
		expect(getByText('Test description')).toBeTruthy();
		expect(getByText('What will you do?')).toBeTruthy();
		// We're not testing for the choice text directly since it's displayed via the mocked component
	});

	it('does not render when dream is null', () => {
		// Arrange & Act
		const { container } = render(DreamEventOverlay, {
			dream: null,
			onClose: mockOnClose
		});

		// Assert
		// Should only have style element
		expect(container.childElementCount).toBe(0);
	});

	it('calls onClose when escape key is pressed', async () => {
		// Arrange
		const { container } = render(DreamEventOverlay, {
			dream: mockDream,
			onClose: mockOnClose
		});

		// Act
		await fireEvent.keyDown(container.querySelector('[role="dialog"]')!, { key: 'Escape' });

		// Assert
		expect(mockOnClose).toHaveBeenCalled();
	});

	it('calls onClose when clicking outside content area', async () => {
		// Arrange
		const { container } = render(DreamEventOverlay, {
			dream: mockDream,
			onClose: mockOnClose
		});

		// Act
		await fireEvent.click(container.querySelector('[role="dialog"]')!);

		// Assert
		expect(mockOnClose).toHaveBeenCalled();
	});

	it('does not call onClose when clicking inside content area', async () => {
		// Arrange
		const { container } = render(DreamEventOverlay, {
			dream: mockDream,
			onClose: mockOnClose
		});

		// Act
		await fireEvent.click(container.querySelector('[role="document"]')!);

		// Assert
		expect(mockOnClose).not.toHaveBeenCalled();
	});
});
