import type { RequestEvent } from '@sveltejs/kit';
import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';
import { base } from '$app/paths';
import type { ComponentInfo } from '$lib-docs/types';
import { fromPairs, kebabCase, sortBy, startCase, toPairs } from 'lodash-es';

type SidebarLink = { slug: string; title: string };

function sortRecord(record: Record<string, unknown>): Record<string, unknown> {
	return fromPairs(sortBy(toPairs(record), ([key]) => key));
}

const components: Record<string, ComponentInfo> = structuredClone(
	import.meta.glob('$lib-docs/generated/data/*.json', {
		as: 'json',
		eager: true
	})
);

export async function GET(request: RequestEvent) {
	const handler = createSidebarRequestHandler({
		exclude: `${base}/docs/components/**`,
		resolveSlug: ({ resolve }) => base + resolve()
	});
	const response = await handler(request);

	const sidebarObject = JSON.parse(await response.text());

	// add an entry for each component
	const componentLinks: Record<string, SidebarLink[]> = {};

	Object.values(components).forEach((component) => {
		if (component.pathParts.length === 0) {
			console.warn(`Component ${component.name} has no category in its pathParts`);
			return;
		}

		const categoryName = `${startCase(component.pathParts.at(0))} Components`;

		componentLinks[categoryName] ??= [];
		componentLinks[categoryName].push({
			slug: `${base}/docs/components/${kebabCase(component.name)}`,
			title: component.name
		});
	});

	// alphabetical happens to make sense
	const sortedComponentLinks = sortRecord(componentLinks);

	sidebarObject.links = { ...sidebarObject.links, ...sortedComponentLinks };

	return new Response(JSON.stringify(sidebarObject));
}
