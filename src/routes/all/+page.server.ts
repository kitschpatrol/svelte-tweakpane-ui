import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { glob } from 'glob';

export const load: PageServerLoad = async () => {
	let examples = await glob('./src/examples/**/*.svelte');
	if (examples.length === 0) error(404, 'Component not found');

	examples = examples.sort((a, b) => a.localeCompare(b));

	console.log(examples);
	return {
		examples
	};
};
