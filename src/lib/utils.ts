import type { FolderApi, Pane, TabPageApi } from 'tweakpane';
import type { Theme } from '$lib/theme';

// user-facing types
export type { TpPluginBundle as Plugin, Bindable as BindingObject } from '@tweakpane/core';

// internal types
export type Container = Pane | FolderApi | TabPageApi;

// from
// doesn't work for hover expansion when imported, only if defined in the file where it's used
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & NonNullable<unknown>;

// from
// this works
export type SimplifyDeep<Type> = Type extends Theme // exclude Theme
	? Type
	: { [TypeKey in keyof Type]: SimplifyDeep<Type[TypeKey]> };

export type ExtractTuple<T> = T extends (infer U)[] ? U : never;
export type ExtractObject<T> = T extends object ? T : never;

/**
 * Needed to conveniently use $$Events as the single source of truth for component events
 * Performs the transformation necessary (extracting detail types) to pass the $$Events
 * type into createEventDispatcher(). See [documentation](https://svelte.dev/docs/typescript#script-lang-ts-events).
 *
 * An alternative would be to use a custom dispatcher, like [Threlte does])https://github.com/threlte/threlte/blob/main/packages/core/src/lib/lib/createRawEventDispatcher.ts_.
 *
 */
export type UnwrapCustomEvents<T> = {
	[P in keyof T]: T[P] extends CustomEvent<infer detail> ? detail : never;
};

// utility functions

/**
 * There's no way to enforce readonly properties in Svelte components, so this is a workaround.
 * See [general approach](https://github.com/sveltejs/svelte/issues/7712#issuecomment-1642470141) and [runtime error approach](https://github.com/sveltejs/svelte/issues/7712#issuecomment-1642817764)
 *
 * Generally:
 * ```svelte
 * <script>
 *   export let value = "foo"
 *   let _value;
 *   // if you want to set init value from outside
 *   // uncomment this line:
 *   // _value = value;
 *   $: value = _value;
 * 	 $: enforceReadonly(_value, value, "value");
 * </script>
 *
 * <input bind:value={_value} />
 *
 * This is not perfect and there are some edge cases it doesn't catch because we have to
 * allow assignment to undefined in some internal cases.
 *
 */
export function enforceReadonly(
	internal: unknown,
	external: unknown,
	componentName: string,
	propName: string,
	allowAssignmentToUndefined: boolean = false
) {
	if (
		!(
			external === internal ||
			(allowAssignmentToUndefined && internal === undefined && external !== undefined)
		)
	) {
		console.error(
			`Svelte component "<${componentName}>" property "${propName}" is intended for readonly use.\nAssigning\n"${external}"\nto\n"${internal}"\nis not allowed.`
		);
	}
}

export function isRootPane(container: Container): boolean {
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
