import { defineDomMiddleware } from './dom-middleware';
import { stripTrailingSlash } from './utilities';
const { BASE_URL: baseUrl } = import.meta.env;

export const stripLinkSuffix = defineDomMiddleware((context, document) => {
	if (context.site && baseUrl) {
		const baseValues = [
			`${stripTrailingSlash(context.site.toString())}${stripTrailingSlash(baseUrl)}`,
			`${stripTrailingSlash(baseUrl)}`
		];

		// Find and modify anchor elements
		const anchorElements = document.querySelectorAll('a');
		for (const anchor of anchorElements) {
			let href = anchor.getAttribute('href');
			if (href) {
				for (const baseValue of baseValues) {
					// eslint-disable-next-line max-depth
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

	return document;
});
