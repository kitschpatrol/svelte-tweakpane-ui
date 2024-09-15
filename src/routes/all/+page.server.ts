import { error } from '@sveltejs/kit';
import { glob } from 'glob';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let examples = await glob('./src/examples/**/*.svelte');
	if (examples.length === 0) error(404, 'Component not found');

	examples = examples.sort((a, b) => a.localeCompare(b));

	return {
		examples
	};
};
