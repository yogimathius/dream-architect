import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import DreamProgress from './DreamProgress.svelte';

describe('DreamProgress Component', () => {
	it('shows how many dreams have been explored out of the total', () => {
		render(DreamProgress, { explored: 1, total: 5 });

		expect(screen.getByText('1 / 5 dreams explored')).toBeTruthy();
	});

	it('reflects an updated explored count', () => {
		render(DreamProgress, { explored: 3, total: 5 });

		expect(screen.getByText('3 / 5 dreams explored')).toBeTruthy();
	});

	it('sets the progress bar width proportionally to explored/total', () => {
		const { container } = render(DreamProgress, { explored: 2, total: 5 });

		const fill = container.querySelector('[data-testid="dream-progress-fill"]') as HTMLElement;
		expect(fill.style.width).toBe('40%');
	});

	it('shows a completion message once every dream has been explored', () => {
		render(DreamProgress, { explored: 5, total: 5 });

		expect(screen.getByText(/every corner of your dreamscape/i)).toBeTruthy();
	});

	it('does not show the completion message before full exploration', () => {
		render(DreamProgress, { explored: 4, total: 5 });

		expect(screen.queryByText(/every corner of your dreamscape/i)).toBeNull();
	});
});
