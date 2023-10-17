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

// doesn't create a new object, only works with string keys
export function removeKeys<T extends object>(obj: T, ...keys: string[]): T {
	keys.forEach((key) => {
		if (key in obj) {
			delete obj[key as keyof T];
		}
	});
	return obj;
}

function clickBlocker(e: MouseEvent) {
	// only block user clicks, not programmatic ones
	if (e.isTrusted) e.stopPropagation();
}

// used by folder and pane
export function updateCollapsability(
	isClickToExpandEnabled: boolean,
	element: HTMLElement,
	titleBarClass: string,
	iconClass?: string
) {
	if (element) {
		const titleBarElement = element.getElementsByClassName(titleBarClass)[0] as HTMLButtonElement;

		if (titleBarElement !== undefined) {
			const iconElement = iconClass
				? (element.getElementsByClassName(iconClass)[0] as HTMLDivElement)
				: undefined;

			if (isClickToExpandEnabled) {
				titleBarElement.removeEventListener('click', clickBlocker, { capture: true });
				titleBarElement.style.cursor = 'pointer';

				if (iconElement) iconElement.style.display = 'block';
			} else {
				//expanded = true;
				titleBarElement.addEventListener('click', clickBlocker, { capture: true });
				titleBarElement.style.cursor = 'default';

				if (iconElement) iconElement.style.display = 'none';
			}
		}
	} else {
		// TODO silence this...
		console.warn(`Title bar element not found with class "${titleBarClass}"`);
	}
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
