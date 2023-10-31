import { createMetaRequestHandler } from '@svelteness/kit-docs/node';
import type { RequestEvent } from '@sveltejs/kit';
import { kebabToTitleCase } from '@svelteness/kit-docs';

export async function GET(request: RequestEvent) {
	// TODO does this do anything?
	// const handler = createMetaRequestHandler({ exclude: '*.svelte' });
	const handler = createMetaRequestHandler();
	const response = await handler(request);

	// the default kitdocs request handler will return an empty body for
	// endpoints that are svelte components without frontmatter instead of
	// markdown files, intercept these and add a rational title
	if (response.body) {
		return response;
	} else {
		// no frontmatter title, get the title from the slug
		const title = request.params.slug
			? kebabToTitleCase(request.params.slug.split('_').pop())
			: 'Unknown';

		const metaData = {
			title
		};

		let clone = response.clone();
		let originalText = await clone.text();

		let newResponse = new Response(JSON.stringify(metaData));
		return newResponse;
	}
}
