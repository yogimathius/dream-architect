import { dreams } from '$lib/data/dreams';
import type { Dream } from '$lib/data/dreams';

export function load({ params }: { params: { id: string } }) {
	const dream = dreams.find((d) => d.id === params.id);

	return {
		dream
	};
}
