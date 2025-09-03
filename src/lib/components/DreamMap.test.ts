import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import DreamMap from './DreamMap.svelte';
import type { Dream } from '$lib/data/dreams';

// Mock stores
vi.mock('$lib/stores/dreamStore', () => {
	const dreamStore = {
		subscribe: vi.fn((callback) => {
			callback([
				{
					id: '1',
					title: 'Forest',
					description: 'A forest',
					locked: false,
					choices: []
				},
				{
					id: '2',
					title: 'Caverns',
					description: 'A cavern',
					locked: true,
					choices: []
				}
			]);
			return { unsubscribe: vi.fn() };
		})
	};

	const unlockedDreams = {
		subscribe: vi.fn((callback) => {
			callback([
				{
					id: '1',
					title: 'Forest',
					description: 'A forest',
					locked: false,
					choices: []
				}
			]);
			return { unsubscribe: vi.fn() };
		})
	};

	const activeDreamId = {
		subscribe: vi.fn((callback) => {
			callback(null);
			return { unsubscribe: vi.fn() };
		})
	};

	const playerPosition = {
		subscribe: vi.fn((callback) => {
			callback({ x: 0, y: 0 });
			return { unsubscribe: vi.fn() };
		})
	};

	const isPlayerMoving = {
		subscribe: vi.fn((callback) => {
			callback(false);
			return { unsubscribe: vi.fn() };
		})
	};

	const recentlyUnlockedDreams = {
		subscribe: vi.fn((callback) => {
			callback([]);
			return { unsubscribe: vi.fn() };
		})
	};

	return {
		dreamStore,
		unlockedDreams,
		activeDreamId,
		playerPosition,
		isPlayerMoving,
		recentlyUnlockedDreams,
		movePlayerToPosition: vi.fn(),
		handleDreamNodeClick: vi.fn()
	};
});

// Mock GSAP
vi.mock('gsap', () => ({
	gsap: {
		from: vi.fn(),
		to: vi.fn()
	}
}));

// Mock the child components
vi.mock('./DreamNode.svelte', () => ({
	default: vi.fn()
}));

vi.mock('./PlayerMarker.svelte', () => ({
	default: vi.fn()
}));

describe('DreamMap Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the map container', () => {
		// Arrange & Act
		const { container } = render(DreamMap);

		// Assert
		const mapContainer = container.querySelector('div');
		expect(mapContainer).toBeTruthy();
	});

	// Test will be expanded once other components are linked
	it('initializes with the correct styles', () => {
		// Arrange & Act
		const { container } = render(DreamMap);

		// Assert
		const mapContainer = container.querySelector('div');
		expect(mapContainer?.className).toContain('relative');
		expect(mapContainer?.className).toContain('bg-gradient-to-b');
	});
});
