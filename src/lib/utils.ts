export function getElementIndex(element: HTMLElement): number {
	let index = 0;
	let sibling: Element | null | undefined = element;
	while ((sibling = sibling.previousElementSibling) !== null) {
		index++;
	}

	return index;
}

export function makeSafeKey(input: string): string {
	// Replace problematic keys and characters with a preceding underscore
	return input.replace(/(__proto__|constructor|prototype|\s|\.)/g, (match) => {
		if (match === ' ' || match === '.') {
			return '_';
		}
		return '_' + match;
	});
}
