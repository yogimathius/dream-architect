import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import ErrorBoundaryWithThrowingChild from './__fixtures__/ErrorBoundaryWithThrowingChild.svelte';

describe('ErrorBoundary Component', () => {
	beforeEach(() => {
		// The component logs the caught error deliberately; keep the test output clean.
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders a fallback UI instead of crashing when a child throws', async () => {
		render(ErrorBoundaryWithThrowingChild);

		await waitFor(() => expect(screen.getByText('Something went wrong')).toBeTruthy());
	});

	it('does not render visible fallback markup when fallback is false', async () => {
		const { container } = render(ErrorBoundaryWithThrowingChild, { fallback: false });

		await waitFor(() => expect(container.querySelector('.error-boundary-silent')).toBeTruthy());
		expect(screen.queryByText('Something went wrong')).toBeNull();
	});
});
