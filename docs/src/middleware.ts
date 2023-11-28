import { allProps } from './utils/prop-utils';
import type { MiddlewareEndpointHandler } from 'astro';
import { getCollection } from 'astro:content';
import { defineMiddleware, sequence } from 'astro:middleware';
import { slug } from 'github-slugger';
import { parseHTML } from 'linkedom';

const { BASE_URL } = import.meta.env;

type APIContext = Parameters<MiddlewareEndpointHandler>[0];

const componentLinks = (await getCollection('docs')).reduce(
	(acc, component) => {
		if (component.data.componentData !== undefined) {
			acc[component.data.componentData.name] = `${component.slug}`;
		}
		return acc;
	},
	{} as Record<string, string>
);

function stripTrailingSlash(string: string): string {
	if (string.endsWith('/')) {
		return string.slice(0, -1);
	}
	return string;
}

// helper for dom transformations
// document is mutated
// use old promise syntax instead of await so we don't have to mess
// with the function signature provided by astro

function defineDomTransformMiddleware(
	transform: (document: Document, context: APIContext) => void
) {
	return defineMiddleware(async (context, next) => {
		const response = await next();
		// check if the response is returning some HTML
		if ('headers' in response && response.headers.get('content-type') === 'text/html') {
			const headers = response.headers;
			const html = await response.text();
			const { document } = parseHTML(html);
			transform(document, context);
			return new Response(document.toString(), {
				headers,
				status: 200
			});
		}
		return response;
	});
}

// helper to... linkify words
// ONLY works if the entire child of the element is the word
// document is mutated
function linkifyTerms(node: Node, termDictionary: { [key: string]: string }, base: string = '') {
	if (node.nodeType === node.ELEMENT_NODE && node.parentNode && node.ownerDocument) {
		const text = (node as HTMLElement).innerText || '';

		if (Object.keys(termDictionary).includes(text)) {
			const link = node.ownerDocument.createElement('a');
			// todo use Astro path functions...

			link.href = `${base.length > 0 ? base + '/' : ''}${termDictionary[text]}`;

			// wrap the node in the link
			node.parentNode.insertBefore(link, node);
			link.appendChild(node);
		}
	}
}

const externalLinkAnnotator = defineDomTransformMiddleware((document, context) => {
	const localHostname = 'localhost';
	const { hostname: ourHostname } = context.site ?? { hostname: '' };
	// not on hero pages
	(
		document.querySelectorAll('html:not([data-has-hero]) a') as NodeListOf<HTMLAnchorElement>
	).forEach((element) => {
		try {
			const { hostname } = new URL(element.href);
			if (hostname !== ourHostname && hostname !== localHostname && hostname !== '') {
				element.classList.add('external-link');
				element.setAttribute('rel', 'noopener noreferrer');
			}
		} catch {
			// assume invalid URLs are internal
		}
	});
});

const automaticComponentLinks = defineDomTransformMiddleware((document, context) => {
	// filter out own page
	const componentLinksNotSelf = Object.entries(componentLinks).reduce(
		(acc, [componentName, componentSlug]) => {
			if (context.props.slug !== componentSlug) {
				acc[`<${componentName}>`] = componentSlug;
			}
			return acc;
		},
		{} as Record<string, string>
	);

	[...document.getElementsByTagName('code')].forEach((element) => {
		linkifyTerms(element, componentLinksNotSelf, BASE_URL);
	});
});

const automaticPropLinks = defineDomTransformMiddleware((document, context) => {
	const componentData = context?.props?.entry?.data?.componentData;
	if (componentData) {
		const props = allProps(context.props.entry.data.componentData);

		const propLinks = props.reduce(
			(acc, prop) => {
				acc[prop.name] = `#${slug(prop.name)}`;
				return acc;
			},
			{} as Record<string, string>
		);

		[...document.getElementsByTagName('code')].forEach((element) => {
			linkifyTerms(element, propLinks);
		});
	}
});

const addLinkPrefix = defineDomTransformMiddleware((document) => {
	['href', 'src'].forEach((attribute) => {
		document.querySelectorAll(`[${attribute}]`).forEach((element) => {
			const attr = element.getAttribute(attribute);
			if (attr?.startsWith('/_astro/')) {
				// add the base prefix
				element.setAttribute(attribute, `${stripTrailingSlash(BASE_URL ?? '')}${attr}`);
			}
		});
	});
});

const stripLinkSuffix = defineDomTransformMiddleware((document, context) => {
	if (context.site && BASE_URL) {
		const baseValues = [
			`${stripTrailingSlash(context.site.toString())}${stripTrailingSlash(BASE_URL)}`,
			`${stripTrailingSlash(BASE_URL)}`
		];

		// Find and modify anchor elements
		const anchorElements = document.querySelectorAll('a');
		anchorElements.forEach((anchor) => {
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
		});
	}
});

// add heading anchor links (VuePress style)
const addHeadingAnchorLinks = defineDomTransformMiddleware((document) => {
	const tocLinks = [...document.querySelectorAll('starlight-toc nav a')] as HTMLAnchorElement[];
	const headings = tocLinks.map((link) => {
		const id = link.getAttribute('href')?.slice(1);
		return document.getElementById(id || '');
	}) as HTMLHeadingElement[];

	headings.forEach((heading) => {
		// skip h1
		if (heading.nodeName !== 'H1') {
			// create anchor link
			const link = heading.ownerDocument.createElement('a');
			link.href = `#${heading.id}`;

			const span = heading.ownerDocument.createElement('span');
			span.ariaHidden = 'true';
			span.className = 'anchor-icon';
			span.innerHTML = '🔗';

			link.appendChild(span);

			const wrapper = heading.ownerDocument.createElement('div');
			wrapper.className = 'heading-anchor-wrapper';

			// wrap the heading and link in a div
			heading.parentNode?.insertBefore(wrapper, heading);
			wrapper.appendChild(heading);
			wrapper.appendChild(link);
		}
	});
});

export const onRequest = sequence(
	externalLinkAnnotator,
	automaticComponentLinks,
	automaticPropLinks,
	addHeadingAnchorLinks,
	addLinkPrefix,
	stripLinkSuffix
);
