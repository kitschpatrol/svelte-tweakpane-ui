import { defineDomMiddleware } from './dom-middleware'
import { stripTrailingSlash } from './utilities'
const { BASE_URL: baseUrl } = import.meta.env

export const addLinkPrefix = defineDomMiddleware((_, document) => {
	for (const attribute of ['href', 'src']) {
		for (const element of document.querySelectorAll(`[${attribute}]`)) {
			const attribute_ = element.getAttribute(attribute)
			if (attribute_?.startsWith('/_astro/')) {
				// Add the base prefix
				element.setAttribute(attribute, `${stripTrailingSlash(baseUrl ?? '')}${attribute_}`)
			}
		}
	}

	return document
})
