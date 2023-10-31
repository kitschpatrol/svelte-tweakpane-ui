import type { RequestEvent } from '@sveltejs/kit';
import { createSidebarRequestHandler } from '@svelteness/kit-docs/node';
import type { ComponentInfo } from '$lib-docs/types/ComponentInfo';
import { kebabCase } from 'lodash-es';

type SidebarLink = { title: string; slug: string };

const components: Record<string, ComponentInfo> = structuredClone(
	import.meta.glob('$lib-docs/generated/data/*.json', {
		eager: true,
		as: 'json'
	})
);

export async function GET(request: RequestEvent) {
	const handler = createSidebarRequestHandler();
	const response = await handler(request);

	const sidebarObject = JSON.parse(await response.text());

	// add an entry for each component
	const componentLinks: Record<string, SidebarLink[]> = {
		Components: []
	};

	Object.values(components).forEach((component) => {
		componentLinks.Components.push({
			title: component.name,
			slug: `/docs/components/${kebabCase(component.name)}`
		});
	});

	sidebarObject.links = { ...sidebarObject.links, ...componentLinks };

	return new Response(JSON.stringify(sidebarObject));
}
