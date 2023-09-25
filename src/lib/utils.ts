import type { FolderApi, Pane, TabPageApi } from 'tweakpane';

export type TpContainer = Pane | FolderApi | TabPageApi;

export function isRootPane(container: TpContainer): boolean {
	return container.constructor.name === 'Pane';
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function getElementIndex(element: HTMLElement): number {
	let index = 0;
	let sibling: Element | null | undefined = element;
	while ((sibling = sibling.previousElementSibling) !== null) {
		index++;
	}

	return index;
}

export function makeSafeKey(input: string | undefined, defaultKey: string = 'key'): string {
	if (input === undefined) return defaultKey;

	// Replace problematic keys and characters with a preceding underscore
	return input.replace(/(__proto__|constructor|prototype|\s|\.)/g, (match) => {
		if (match === ' ' || match === '.') {
			return '_';
		}
		return '_' + match;
	});
}

export function stripProps(propsObject: { [key: string]: unknown }, ...keysToStrip: string[]) {
	const newObj = { ...propsObject };
	keysToStrip.forEach((key) => {
		delete newObj[key];
	});
	return newObj;
}

// tries to be smart about rows and columns
// if none are provided, it makes the most square grid possible
// if one is provided, it lets the undefined axis grow / shrink
// as needed
// if both are provided, values may will be clipped
export function getGridDimensions(
	itemCount: number,
	maxColumns?: number,
	maxRows?: number
): { rows: number; columns: number } {
	let rows: number, columns: number;

	if (maxColumns && maxRows) {
		// No flexing; items can exceed the available slots
		rows = Math.min(Math.ceil(itemCount / maxColumns), maxRows);
		columns = Math.min(maxColumns, itemCount);
	} else if (maxColumns) {
		// Only maxColumns defined, so rows will flex
		rows = Math.ceil(itemCount / maxColumns);
		columns = maxColumns;
	} else if (maxRows) {
		// Only maxRows defined, so columns will flex
		columns = Math.ceil(itemCount / maxRows);
		rows = maxRows;
	} else {
		// Neither maxColumns nor maxRows defined; create a square grid
		columns = Math.ceil(Math.sqrt(itemCount));
		rows = Math.ceil(itemCount / columns);
	}

	return { rows, columns };
}
