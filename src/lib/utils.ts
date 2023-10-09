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

// type utilities
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Omits properties that have type `never`. Utilizes key-remapping introduced in
 * TS4.1.
 *
 * @example
 * ```ts
 * type A = { x: never; y: string; }
 * OmitNever<A> // => { y: string; }
 * ```
 */
export type OmitNever<T extends Record<string, unknown>> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Constructs a Record type that only includes shared properties between `A` and
 * `B`. If the value of a key is different in `A` and `B`, `SharedProperties<A,
 * B>` attempts to choose a type that is assignable to the types of both values.
 *
 * Note that this is NOT equivalent to `A & B`.
 *
 * @example
 * ```ts
 * type A = { x: string; y: string; }
 * type B = { y: string; z: string }
 * type C = { y: string | number; }
 *
 * A & B                  // => { x: string; y: string; z: string; }
 * SharedProperties<A, B> // => { y: string; }
 * SharedProperties<B, C> // => { y: string | number; }
 * ```
 */
export type SharedProperties<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>;

export type ExcludedTypes<T, U> = {
	[K in Exclude<keyof T, keyof U>]: T[K];
};

export type IsOptional<T, K extends keyof T> = undefined extends T[K] ? true : false;
export type IsOnlyUndefined<T> = [T] extends [undefined]
	? undefined extends T
		? true
		: false
	: false;

export type RedefineProp<T, K extends keyof T, NewType> = Omit<T, K> &
	(IsOptional<T, K> extends true ? { [P in K]?: NewType } : { [P in K]: NewType });
