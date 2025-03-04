// TODO move this to a package

import type { APIContext, MiddlewareHandler } from 'astro'
import { defineMiddleware } from 'astro:middleware'
import { parseHTML } from 'linkedom'

export type DomMiddlewareHandler = (
	context: APIContext,
	document: Document,
) => Document | Promise<Document>

/**
 * Define a DOM middleware handler that can be used in `domSequence()`.
 *
 * This is a convenience function that allows you to define a middleware handler that operates on the DOM.
 */
export function defineDomMiddleware(fn: DomMiddlewareHandler): DomMiddlewareHandler {
	return fn
}

/**
 * Define a DOM middleware handler in the form of Astro's MiddlewareHandler.
 */
export function defineDomMiddlewareAsMiddleware(fn: DomMiddlewareHandler): MiddlewareHandler {
	return domSequence(fn)
}

/**
 * Like Astro's `sequence()` middleware, but passes DOM objects through instead of Response objects.
 *
 * Running as a sequence allows you to run multiple DOM transforms via a single parse and render of the DOM.
 */
export function domSequence(...domHandlers: DomMiddlewareHandler[]): MiddlewareHandler {
	return defineMiddleware(async (context, next) => {
		const response = await next()
		// Only operate on HTML responses
		if (response.headers.get('content-type') !== 'text/html') {
			return response
		}

		const html = await response.text()
		let { document } = parseHTML(html)

		// Not actually copying the document, leaving that to the handlers,
		//  so mutation is possible... gross but hypothetically for efficiency...
		for (const domHandler of domHandlers) {
			document = await domHandler(context, document)
		}

		// Linkedom implements a `toString()` that serializes the document back to HTML
		// eslint-disable-next-line ts/no-base-to-string, node/no-unsupported-features/node-builtins
		return new Response(document.toString(), {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText,
		})
	})
}
