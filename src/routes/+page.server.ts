import type { PageServerLoad } from './$types';
import { globSync } from 'glob';

export const load: PageServerLoad = async () => {
	const examples = globSync('./src/examples/**/*.svelte')
		.map((example) => example.replace('src/examples/', './'))
		.sort((a, b) => {
			return a.localeCompare(b);
		});

	return {
		examples
	};
};
