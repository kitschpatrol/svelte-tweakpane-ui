import { defineDomMiddleware } from './dom-middleware'
import { stripTrailingSlash } from './utilities'
const { BASE_URL: baseUrl } = import.meta.env

export const addLinkPrefix = defineDomMiddleware((_, document) => {
	for (const attribute of ['href', 'src']) {
		for (const element of document.querySelectorAll(`[${attribute}]`)) {
			const theAttribute = element.getAttribute(attribute)
			if (theAttribute?.startsWith('/_astro/')) {
				// Add the base prefix
				// eslint-disable-next-line ts/no-unnecessary-condition
				element.setAttribute(attribute, `${stripTrailingSlash(baseUrl ?? '')}${theAttribute}`)
			}
		}
	}

	return document
})
