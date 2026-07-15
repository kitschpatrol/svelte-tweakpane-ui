/**
 * Links terms in the given node based on a dictionary of terms and their
 * corresponding URLs.
 *
 * ONLY works if the entire child of the element is the word
 *
 * Document is mutated
 *
 * @param node - The node to process.
 * @param termDictionary - A record mapping terms to their URLs.
 * @param base - The base URL for linking.
 */
export function linkifyTerms(node: Node, termDictionary: Record<string, string>, base = '') {
	if (node.nodeType !== node.ELEMENT_NODE || !node.parentNode || !node.ownerDocument) {
		return
	}

	// eslint-disable-next-line ts/no-unnecessary-condition
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
