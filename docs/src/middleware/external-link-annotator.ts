import { defineDomMiddleware } from './dom-middleware';

export const externalLinkAnnotator = defineDomMiddleware((context, document) => {
	const localHostname = 'localhost';
	const { hostname: ourHostname } = context.site ?? { hostname: '' };
	// Not on hero pages
	for (const element of document.querySelectorAll<HTMLAnchorElement>(
		'html:not([data-has-hero]) div.sl-markdown-content a'
	)) {
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

	return document;
});
