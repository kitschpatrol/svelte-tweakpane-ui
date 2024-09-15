import { glob } from 'glob';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const examples = await glob('./src/examples/**/*.svelte');
	const sortedExamples = examples
		.map((example) => example.replace('src/examples/', './'))
		.sort((a, b) => a.localeCompare(b));

	return {
		examples: sortedExamples
	};
};
