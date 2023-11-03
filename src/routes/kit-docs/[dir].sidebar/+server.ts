import type { RequestEvent } from '@sveltejs/kit';
import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';
import type { ComponentInfo } from '$lib-docs/types';
import { kebabCase, startCase, fromPairs, sortBy, toPairs } from 'lodash-es';

type SidebarLink = { title: string; slug: string };

function sortRecord(record: Record<string, unknown>): Record<string, unknown> {
	return fromPairs(sortBy(toPairs(record), ([key]) => key));
}

const components: Record<string, ComponentInfo> = structuredClone(
	import.meta.glob('$lib-docs/generated/data/*.json', {
		eager: true,
		as: 'json'
	})
);

export async function GET(request: RequestEvent) {
	const handler = createSidebarRequestHandler({ exclude: '/docs/components/**' });
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
			title: component.name,
			slug: `/docs/components/${kebabCase(component.name)}`
		});
	});

	// alphabetical happens to make sense
	const sortedComponentLinks = sortRecord(componentLinks);

	sidebarObject.links = { ...sidebarObject.links, ...sortedComponentLinks };

	return new Response(JSON.stringify(sidebarObject));
}
