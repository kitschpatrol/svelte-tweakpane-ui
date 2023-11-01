import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { startCase } from 'lodash-es';
import type { ComponentInfo } from '$lib-docs/types';
import { walkNestedObject } from '$lib-docs/utils';
import markdownit from 'markdown-it';

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

	// don't use createMarkdownParser(), because it replaces
	// certain elements with custom components, and svelte doesn't want to
	// compile and render them down without going out to a file first,
	// which is not worth it for simple markdown in the code documentation
	// various permutations of dynamic on-demand compilation, loading, and rendering
	// were attempted without success
	const md = new markdownit();

	// render any markdown in-place, mutates in-place
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
					// treat the big doc block as... blocks
					parentObj[key] = md.render(value);
					break;
				default:
					// treat everything else as inline
					parentObj[key] = md.renderInline(value);
					break;
			}
		}
	});

	return {
		component
	};
};
