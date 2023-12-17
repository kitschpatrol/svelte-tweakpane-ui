import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { glob } from 'glob';

export const load: PageServerLoad = async ({ params }) => {
	const examples = await glob('./src/examples/**/*.svelte');
	const match = examples.find((path) => path.endsWith(`${params.component}.svelte`));

	if (match === undefined) error(404, 'Not found');

	return {
		match
	};
};
