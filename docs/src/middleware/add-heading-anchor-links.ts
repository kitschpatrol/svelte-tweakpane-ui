import { defineDomMiddleware } from './dom-middleware';

// Add heading anchor links (VuePress style)
export const addHeadingAnchorLinks = defineDomMiddleware((_, document) => {
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

	return document;
});
