import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { startCase } from 'lodash-es';
import type { ComponentInfo } from '$lib-docs/types/ComponentInfo';
import markdownit from 'markdown-it';

type NestedObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

const walkNestedObject = (
	obj: NestedObject,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (value: any, key: string, parentObj: NestedObject, path: string[]) => void,
	path: string[] = []
) => {
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const newPath = [...path, key];
			const value = obj[key];

			// Apply the callback to the current value
			callback(value, key, obj, newPath);

			if (typeof value === 'object' && value !== null) {
				// Recurse if the value is another object
				walkNestedObject(value, callback, newPath);
			}
		}
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const components: Record<string, ComponentInfo> = structuredClone(
		import.meta.glob('$lib-docs/generated/data/*.json', {
			eager: true,
			as: 'json'
		})
	);

	const component = Object.values(components).find((component) => {
		return component.name === startCase(params.slug).replace(/ /g, '');
	});

	if (!component) throw error(404, 'Component not found');

	// render all markdown, except the example code fences which has to be
	// its own component to make it through the KitDocs pipeline

	// don't use createMarkdownParser() for most situations, because it replaces
	// certain elements with custom components, and svelte doesn't want to
	// compile and render them down without going out to a file first
	// not worth it for simple markdown in the code documentation
	const md = new markdownit();

	// render any markdown in-place
	walkNestedObject(component, (value, key, parentObj) => {
		if (typeof value === 'string') {
			// special handling of certain keys

			switch (key) {
				case 'example':
					// don't markdown render examples, instead we load pre-rendered
					// markdown files from the genreated files
					// (so we can use the KitDocs component in the page tempalate)
					parentObj[key] = value;
					break;
				case 'doc':
					parentObj[key] = md.render(value);
					break;
				default:
					parentObj[key] = md.renderInline(value);
					break;
			}
		}
	});

	return {
		component
	};
};
