import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { ComponentInfo } from '$lib-docs/types';
import { kebabCase, startCase } from 'lodash-es';
import markdownit from 'markdown-it';
import traverse from 'traverse';

function linkifyComponentReferences(
	str: string,
	validComponentNames: string[],
	markdownStyleLink: boolean = true
): string {
	return str.replaceAll(/(`?)<([A-Z]\w+)>(`?)/g, (match, prefix, name, postfix) => {
		if (validComponentNames.includes(name)) {
			// Replace with link
			if (markdownStyleLink) {
				return `[${prefix ?? ''}<${name}>${postfix ?? ''}](${base}/docs/components/${kebabCase(
					name
				)})`;
			} else {
				return `${prefix ?? ''}<a href="${base}/docs/components/${kebabCase(
					name
				)}">&lt;${name}&gt;</a>${postfix ?? ''}`;
			}
		} else {
			// No replacement, return the original match
			return match;
		}
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const components: Record<string, ComponentInfo> = structuredClone(
		import.meta.glob('$lib-docs/generated/data/*.json', {
			as: 'json',
			eager: true
		})
	);

	const componentNames = Object.values(components).map((component) => component.name);

	const component = Object.values(components).find((component) => {
		return component.name === startCase(params.slug).replace(/ /g, '');
	});

	// todo redirect to the component page for non-kebab params?

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
	traverse(component).forEach(function (value) {
		// ignore the root level default key, artifact of importing the json files
		if (typeof value === 'string' && !(this.path.at(0) === 'default')) {
			switch (this.key) {
				case 'example':
					// don't markdown render examples, instead we load pre-rendered
					// markdown files from the genreated files
					// (so we can use the KitDocs component in the page tempalate)
					break;
				case 'doc':
					// expand component strings like <Button> into links
					// treat the big doc block as... blocks
					this.update(md.render(linkifyComponentReferences(value, componentNames)));
					break;
				default:
					// treat everything else as inline
					this.update(md.renderInline(linkifyComponentReferences(value, componentNames)), true);
					break;
			}
		}
	});

	return {
		component
	};
};
