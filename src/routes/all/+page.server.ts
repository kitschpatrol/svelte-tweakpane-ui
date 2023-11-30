import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { globSync } from 'glob';

export const load: PageServerLoad = async () => {
	let examples = globSync('./src/examples/**/*.svelte');

	if (examples.length === 0) throw error(404, 'Component not found');

	examples = examples
		.map((example) => example.replace('src/routes/all-examples/', './'))
		.sort((a, b) => {
			return a.localeCompare(b);
		});

	console.log(examples);
	return {
		examples
	};
};
