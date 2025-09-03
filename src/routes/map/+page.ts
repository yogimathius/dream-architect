import { dreams } from '$lib/data/dreams';
import type { Dream } from '$lib/data/dreams';

export function load() {
	return {
		dreams
	};
}
