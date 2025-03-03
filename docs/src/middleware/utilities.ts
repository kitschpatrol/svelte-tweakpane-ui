export function stripTrailingSlash(string: string): string {
	if (string.endsWith('/')) {
		return string.slice(0, -1)
	}

	return string
}

// Helper to... linkify words
// ONLY works if the entire child of the element is the word
// document is mutated
export function linkifyTerms(
	node: Node,
	termDictionary: Record<string, string>,
	base: string = '',
) {
	if (node.nodeType === node.ELEMENT_NODE && node.parentNode && node.ownerDocument) {
		const text = (node as HTMLElement).textContent ?? ''

		if (Object.keys(termDictionary).includes(text)) {
			const link = node.ownerDocument.createElement('a')
			// TODO use Astro path functions...

			link.href = `${base.length > 0 ? base + '/' : ''}${termDictionary[text]}`

			// Wrap the node in the link
			node.parentNode.insertBefore(link, node)
			link.append(node)
		}
	}
}
