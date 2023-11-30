import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { globSync } from 'glob';

export const load: PageServerLoad = async ({ params }) => {
	const examples = globSync('./src/examples/**/*.svelte');

	const match = examples.find((path) => path.endsWith(`${params.component}.svelte`));

	if (match === undefined) throw error(404, 'Not found');

	return {
		match
	};
};
