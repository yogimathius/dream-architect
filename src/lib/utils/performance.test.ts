import { describe, it, expect } from 'vitest';
import { computeWebVitalsScore } from './performance';

describe('computeWebVitalsScore', () => {
	it('scores a perfect, empty set of vitals as 100', () => {
		expect(computeWebVitalsScore({})).toBe(100);
	});

	it('deducts 25 points for a poor LCP (> 4000ms)', () => {
		expect(computeWebVitalsScore({ LCP: 5000 })).toBe(75);
	});

	it('deducts 10 points for a needs-improvement LCP (> 2500ms, <= 4000ms)', () => {
		expect(computeWebVitalsScore({ LCP: 3000 })).toBe(90);
	});

	it('does not deduct for a good LCP (<= 2500ms)', () => {
		expect(computeWebVitalsScore({ LCP: 2000 })).toBe(100);
	});

	it('stacks deductions across multiple poor vitals', () => {
		expect(computeWebVitalsScore({ LCP: 5000, FID: 400, CLS: 0.3, FCP: 3500 })).toBe(10);
	});

	it('floors at the sum of the worst per-vital deductions (25+25+25+15), never below 0', () => {
		expect(computeWebVitalsScore({ LCP: 99999, FID: 99999, CLS: 99, FCP: 99999 })).toBe(10);
	});
});
