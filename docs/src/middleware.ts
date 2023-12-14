/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { allProps } from './utils/prop-utils';
import type { MiddlewareHandler } from 'astro';
import { getCollection } from 'astro:content';
import { defineMiddleware, sequence } from 'astro:middleware';
import { slug } from 'github-slugger';
import { parseHTML } from 'linkedom';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BASE_URL } = import.meta.env;

type ApiContext = Parameters<MiddlewareHandler>[0];

const documentationCollection = await getCollection('docs');
const componentLinks = documentationCollection.reduce<Record<string, string>>((acc, component) => {
	if (component.data.componentData !== undefined) {
		acc[component.data.componentData.name] = `${component.slug}`;
	}

	return acc;
}, {});

function stripTrailingSlash(string: string): string {
	if (string.endsWith('/')) {
		return string.slice(0, -1);
	}

	return string;
}

// Helper for dom transformations
// document is mutated
// use old promise syntax instead of await so we don't have to mess
// with the function signature provided by astro

function defineDomTransformMiddleware(
	transform: (document: Document, context: ApiContext) => void
) {
	return defineMiddleware(async (context, next) => {
		const response = await next();
		// Check if the response is returning some HTML
		if ('headers' in response && response.headers.get('content-type') === 'text/html') {
			const { headers } = response;
			const html = await response.text();
			const { document } = parseHTML(html);
			transform(document, context);
			// eslint-disable-next-line @typescript-eslint/no-base-to-string
			return new Response(document.toString(), {
				headers,
				status: 200
			});
		}

		return response;
	});
}

// Helper to... linkify words
// ONLY works if the entire child of the element is the word
// document is mutated
function linkifyTerms(node: Node, termDictionary: Record<string, string>, base: string = '') {
	if (node.nodeType === node.ELEMENT_NODE && node.parentNode && node.ownerDocument) {
		const text = (node as HTMLElement).textContent ?? '';

		if (Object.keys(termDictionary).includes(text)) {
			const link = node.ownerDocument.createElement('a');
			// TODO use Astro path functions...

			link.href = `${base.length > 0 ? base + '/' : ''}${termDictionary[text]}`;

			// Wrap the node in the link
			node.parentNode.insertBefore(link, node);
			link.append(node);
		}
	}
}

const externalLinkAnnotator = defineDomTransformMiddleware((document, context) => {
	const localHostname = 'localhost';
	const { hostname: ourHostname } = context.site ?? { hostname: '' };
	// Not on hero pages
	for (const element of document.querySelectorAll(
		'html:not([data-has-hero]) div.sl-markdown-content a'
	) as NodeListOf<HTMLAnchorElement>) {
		try {
			const { hostname } = new URL(element.href);
			if (hostname !== ourHostname && hostname !== localHostname && hostname !== '') {
				element.classList.add('external-link');
				element.setAttribute('rel', 'noopener noreferrer');
			}
		} catch {
			// Assume invalid URLs are internal
		}
	}
});

const automaticComponentLinks = defineDomTransformMiddleware((document, context) => {
	// Filter out own page
	const componentLinksNotSelf = Object.entries(componentLinks).reduce<Record<string, string>>(
		(acc, [componentName, componentSlug]) => {
			if (context.props.slug !== componentSlug) {
				acc[`<${componentName}>`] = componentSlug;
			}

			return acc;
		},
		{}
	);

	for (const element of document.querySelectorAll('code')) {
		linkifyTerms(element, componentLinksNotSelf, BASE_URL);
	}
});

const automaticPropLinks = defineDomTransformMiddleware((document, context) => {
	const componentData = context?.props?.entry?.data?.componentData;
	if (componentData) {
		const props = allProps(context.props.entry.data.componentData);

		const propLinks = props.reduce<Record<string, string>>((acc, prop) => {
			acc[prop.name] = `#${slug(prop.name)}`;
			return acc;
		}, {});

		for (const element of document.querySelectorAll('code')) {
			linkifyTerms(element, propLinks);
		}
	}
});

const addLinkPrefix = defineDomTransformMiddleware((document) => {
	for (const attribute of ['href', 'src']) {
		for (const element of document.querySelectorAll(`[${attribute}]`)) {
			const attribute_ = element.getAttribute(attribute);
			if (attribute_?.startsWith('/_astro/')) {
				// Add the base prefix
				element.setAttribute(attribute, `${stripTrailingSlash(BASE_URL ?? '')}${attribute_}`);
			}
		}
	}
});

const stripLinkSuffix = defineDomTransformMiddleware((document, context) => {
	if (context.site && BASE_URL) {
		const baseValues = [
			`${stripTrailingSlash(context.site.toString())}${stripTrailingSlash(BASE_URL)}`,
			`${stripTrailingSlash(BASE_URL)}`
		];

		// Find and modify anchor elements
		const anchorElements = document.querySelectorAll('a');
		for (const anchor of anchorElements) {
			let href = anchor.getAttribute('href');
			if (href) {
				for (const baseValue of baseValues) {
					if (href.startsWith(baseValue) && href.includes('.html')) {
						// Strip "html" from the end of the href
						href = href.replace(/\.html$/, '');
						anchor.setAttribute('href', href);
						break; // Exit the loop once we've matched a base value
					}
				}
			}
		}
	}
});

// Add heading anchor links (VuePress style)
const addHeadingAnchorLinks = defineDomTransformMiddleware((document) => {
	const tocLinks = [...document.querySelectorAll('starlight-toc nav a')] as HTMLAnchorElement[];
	const headings = tocLinks.map((link) => {
		const id = link.getAttribute('href')?.slice(1);

		return document.querySelector(id ? `#${id}` : '');
	}) as HTMLHeadingElement[];

	for (const heading of headings) {
		// Skip h1
		if (heading.nodeName !== 'H1') {
			// Create anchor link
			const link = heading.ownerDocument.createElement('a');
			link.href = `#${heading.id}`;

			const span = heading.ownerDocument.createElement('span');
			span.ariaHidden = 'true';
			span.dataset.pagefindIgnore = 'true';
			span.className = 'anchor-icon';
			span.innerHTML = '🔗';

			link.append(span);

			const wrapper = heading.ownerDocument.createElement('div');
			wrapper.className = 'heading-anchor-wrapper';

			// Wrap the heading and link in a div
			heading.parentNode?.insertBefore(wrapper, heading);
			wrapper.append(heading);
			wrapper.append(link);
		}
	}
});

export const onRequest = sequence(
	externalLinkAnnotator,
	automaticComponentLinks,
	automaticPropLinks,
	addHeadingAnchorLinks,
	addLinkPrefix,
	stripLinkSuffix
);
