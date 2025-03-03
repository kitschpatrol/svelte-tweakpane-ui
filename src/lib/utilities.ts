/* eslint-disable ts/no-unsafe-call */
/* eslint-disable ts/no-explicit-any */
/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable ts/no-unnecessary-type-parameters */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unnecessary-type-arguments */

// Type aliases and utility functions

import type { Theme } from '$lib/theme'
import type { FolderApi, Pane, TabPageApi } from 'tweakpane'

// Internal types
export type Container = FolderApi | Pane | TabPageApi

// From https://github.com/sindresorhus/type-fest doesn't work for hover expansion when imported,
// only if defined in the file where it's used?
export type Simplify<T> = NonNullable<unknown> & { [KeyType in keyof T]: T[KeyType] }

// From https://github.com/sindresorhus/type-fest this works?
export type SimplifyDeep<Type> = Type extends Theme // Exclude Theme
	? Type
	: { [TypeKey in keyof Type]: SimplifyDeep<Type[TypeKey]> }

// Possible alternative to all the explicitly defined value type variations export type
// ExtractTuple<T> = T extends (infer U)[] ? U : never; export type ExtractObject<T> = T extends
// object ? T : never;

export type HasKey<U, V extends PropertyKey> = V extends keyof U ? U[V] : unknown

// User-facing types
import type { Bindable, BladeApi, BladeController, TpPluginBundle, View } from '@tweakpane/core'
export type BindingObject = Bindable
export type Plugin = TpPluginBundle

/**
 * The base event type for value change notification events emitted by various controls.
 */
export type ValueChangeEvent<V> = CustomEvent<{
	/**
	 * The origin of the event.
	 * Changes resulting from the user's direct manipulation of the control will are marked as `internal`.
	 * Changes resulting from manipulation of the bound value from _outside_ the component are marked as `external`.
	 */
	origin: 'external' | 'internal'
	/**
	 * A copy of the value at the time of the event.
	 */
	value: V
}>

/**
 * Needed to conveniently use $$Events as the single source of truth for component events Performs
 * the transformation necessary (extracting detail types) to pass the $$Events type into
 * createEventDispatcher(). See
 * [documentation](https://svelte.dev/docs/typescript#script-lang-ts-events).
 *
 * An alternative would be to use a custom dispatcher, like [Threlte
 * does])https://github.com/threlte/threlte/blob/main/packages/core/src/lib/lib/createRawEventDispatcher.ts_.
 *
 */
export type UnwrapCustomEvents<T> = {
	[P in keyof T]: T[P] extends CustomEvent<infer detail> ? detail : never
}

// Utility functions

/**
 * For CLS SSR calculation
 */
export function rowsForMonitor(buffer?: number, rows?: number, graph?: boolean) {
	if (graph) {
		return Math.max(rows ?? 3, 3)
	}

	if (buffer === undefined && rows === undefined) {
		return 1
	}

	if (buffer === undefined && rows !== undefined) {
		return 1
	}

	if (buffer !== undefined && rows === undefined) {
		return buffer > 1 ? 3 : 1
	}

	if (buffer === 1) {
		return 1
	}

	// Both defined
	return rows ?? 1 // TODO
}

/**
 * Fills an array of length `quantity` with a `value`
 */
export function fillWith<T>(value: T, quantity: number): T[] {
	return Array.from({ length: quantity }, () => value)
}

/**
 * There's no way to enforce readonly properties in Svelte components, so this is a workaround. See
 * [general approach](https://github.com/sveltejs/svelte/issues/7712#issuecomment-1642470141) and
 * [runtime error approach](https://github.com/sveltejs/svelte/issues/7712#issuecomment-1642817764)
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
 *   $: enforceReadonly(_value, value, "value");
 * </script>
 *
 * <input bind:value={_value} />
 *
 * This is not perfect and there are some edge cases it doesn't catch because we have to
 * allow assignment to undefined in some internal cases (via the `allowAssignmentToUndefined` flag).
 *
 */
export function enforceReadonly(
	internal: unknown,
	external: unknown,
	componentName?: string,
	propertyName?: string,
	allowAssignmentToUndefined?: boolean,
) {
	allowAssignmentToUndefined ??= false

	if (
		!(
			external === internal ||
			(allowAssignmentToUndefined && internal === undefined && external !== undefined)
		)
	) {
		const componentString = componentName ? `<${componentName}> ` : ''
		const propertyString = propertyName ? `property "${propertyName}" ` : ''

		console.error(
			`Svelte component "${componentString}" property "${propertyString}" is intended for readonly use.\nAssigning\n"${String(
				external,
			)}"\nto\n"${String(internal)}"\nis not allowed.`,
		)
	}
}

export function isRootPane(container: Container): boolean {
	return container.constructor.name === 'Pane'
}

export function clamp(value: number, min: number, max: number): number {
	// Prioritize min over max
	return Math.min(Math.max(value, min), max)
}

export function getElementIndex(element: HTMLElement): number {
	let index = 0

	let sibling: Element | null | undefined = element
	while ((sibling = sibling.previousElementSibling) !== null) {
		// The Element component can add extra stuff to the DOM which will mess up counting...
		// So we add an extra class to its wrapper and don't let it increment the index.
		// This was the cause of https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/18
		if (!sibling.classList.contains('skip-element-index')) {
			index++
		}
	}

	return index
}

// Doesn't create a new object, only works with string keys
export function removeKeys<T extends Record<string, unknown>>(object: T, ...keys: string[]): T {
	for (const key of keys) {
		if (key in object) {
			// eslint-disable-next-line ts/no-dynamic-delete
			delete object[key as keyof T]
		}
	}

	return object
}

function clickBlocker(event: MouseEvent) {
	// Only block user clicks, not programmatic ones
	if (event.isTrusted) event.stopPropagation()
}

// Used by folder and pane TODO rewrite to use getSwatchButton etc.
export function updateCollapsibility(
	isUserExpandableEnabled: boolean,
	element: HTMLElement | undefined,
	titleBarClass: string,
	iconClass?: string,
) {
	if (element) {
		const titleBarElement = element.querySelector<HTMLButtonElement>(`.${titleBarClass}`)

		if (titleBarElement) {
			const iconElement = iconClass
				? element.querySelector<HTMLDivElement>(`.${iconClass}`)
				: undefined

			if (isUserExpandableEnabled) {
				titleBarElement.removeEventListener('click', clickBlocker, { capture: true })
				titleBarElement.style.cursor = 'pointer'

				if (iconElement) iconElement.style.display = 'block'
			} else {
				// Expanded = true;
				titleBarElement.addEventListener('click', clickBlocker, { capture: true })
				titleBarElement.style.cursor = 'default'

				if (iconElement) iconElement.style.display = 'none'
			}
		}
	} else {
		console.warn(`Title bar element not found with class "${titleBarClass}"`)
	}
}

/**
 * Infers grid dimensions for a given number of items, respecting optional maximums for rows and
 * columns.
 *
 * If no constraints are provided, it creates the most square grid possible.
 *
 * If a single constraint is provided, it lets the undefined axis grow / shrink as needed.
 *
 * If both constraints are provided, values may be clipped.
 */
export function getGridDimensions(
	itemCount: number,
	maxColumns?: number,
	maxRows?: number,
): { columns: number; rows: number } {
	let rows: number
	let columns: number

	if (maxColumns && maxRows) {
		// No flexing; items can exceed the available slots
		rows = Math.min(Math.ceil(itemCount / maxColumns), maxRows)
		columns = Math.min(maxColumns, itemCount)
	} else if (maxColumns) {
		// Only maxColumns defined, so rows will flex
		rows = Math.ceil(itemCount / maxColumns)
		columns = maxColumns
	} else if (maxRows) {
		// Only maxRows defined, so columns will flex
		columns = Math.ceil(itemCount / maxRows)
		rows = maxRows
	} else {
		// Neither maxColumns nor maxRows defined; create a square grid
		columns = Math.ceil(Math.sqrt(itemCount))
		rows = Math.ceil(itemCount / columns)
	}

	return { columns, rows }
}

// eslint-disable-next-line ts/consistent-indexed-object-style
export function tupleToObject<T extends string, O extends { [K in T]: number }>(
	tuple: number[],
	keys: T[],
): O {
	// eslint-disable-next-line ts/consistent-type-assertions
	const result = {} as O

	for (const [index, key] of keys.entries()) {
		// Assert that the assignment is safe
		result[key as keyof O] = tuple[index] as O[keyof O]
	}

	return result
}

export function objectToTuple<T extends string, O extends Record<T, number>>(
	object: O,
	keys: [T],
): [number]
export function objectToTuple<T extends string, O extends Record<T, number>>(
	object: O,
	keys: [T, T],
): [number, number]
export function objectToTuple<T extends string, O extends Record<T, number>>(
	object: O,
	keys: [T, T, T],
): [number, number, number]
export function objectToTuple<T extends string, O extends Record<T, number>>(
	object: O,
	keys: [T, T, T, T],
): [number, number, number, number]
export function objectToTuple<T extends string, O extends Record<T, number>>(
	object: O,
	keys: T[],
): number[] {
	return keys.map((key) => object[key])
}

// Tweakpane  helpers

export function pickerIsOpen(blade: BladeApi<BladeController<View>>): boolean {
	return Boolean((blade.controller as any).valueController?.foldable_?.valMap_?.expanded?.value_)
}

export function getSwatchButton(
	blade: BladeApi<BladeController<View>>,
): HTMLButtonElement | undefined {
	const swatch = ((blade.controller as any)?.valueController?.view?.swatchElement?.querySelector(
		'button',
	) ?? (blade.controller as any)?.valueController?.view?.buttonElement) as
		| HTMLButtonElement
		| undefined

	return swatch
}

// ------------------------

// public runtime helpers, mostly used in examples but re-exported for user's convenience end
// exposed under the Utils namespace alternative might be to scope these under the related
// component's module as static methods?

import type { CubicBezierValue } from '$lib/control/CubicBezier.svelte'
import type { RotationEulerUnit, RotationEulerValue } from '$lib/control/RotationEuler.svelte'
import type { RotationQuaternionValue } from '$lib/control/RotationQuaternion.svelte'

// Utility functions

function quaternionToCssTransform(quaternion: RotationQuaternionValue): string {
	const [x, y, z, w] = (
		Array.isArray(quaternion)
			? quaternion
			: [quaternion.x, quaternion.y, quaternion.z, quaternion.w]
	) as [number, number, number, number]

	const m11 = 1 - 2 * y * y - 2 * z * z
	const m12 = 2 * x * y - 2 * z * w
	const m13 = 2 * x * z + 2 * y * w
	const m21 = 2 * x * y + 2 * z * w
	const m22 = 1 - 2 * x * x - 2 * z * z
	const m23 = 2 * y * z - 2 * x * w
	const m31 = 2 * x * z - 2 * y * w
	const m32 = 2 * y * z + 2 * x * w
	const m33 = 1 - 2 * x * x - 2 * y * y

	return `matrix3d(
  		${m11}, ${m12}, ${m13}, 0,
  		${m21}, ${m22}, ${m23}, 0,
  		${m31}, ${m32}, ${m33}, 0,
  		0, 0, 0, 1
		)`
}

function eulerToCssTransform(
	rotation: RotationEulerValue,
	units: RotationEulerUnit = 'rad', // Rad is component default
): string {
	const [x, y, z] = (Array.isArray(rotation) ? rotation : [rotation.x, rotation.y, rotation.z]) as [
		number,
		number,
		number,
	]
	// Note negative z
	return `rotateX(${x}${units}) rotateY(${y}${units}) rotateZ(${-z}${units})`
}

function cubicBezierToEaseFunction(cubicBezier: CubicBezierValue): (t: number) => number {
	const [_x1, y1, _x2, y2] = (
		Array.isArray(cubicBezier)
			? cubicBezier
			: [cubicBezier.x1, cubicBezier.y1, cubicBezier.x2, cubicBezier.y2]
	) as [number, number, number, number]

	return (t: number): number =>
		(1 - t) ** 3 * 0 + (1 - t) ** 2 * t * 3 * y1 + (1 - t) * t ** 2 * 3 * y2 + t ** 3 * 1
}

// Library exports
export default {
	/**
	 * Convenience function for creating easing functions ready for Svelte's tween and animation
	 * systems
	 * @param cubicBezier - `CubicBezierValue`, probably from a `<CubicBezier>` component
	 * @returns Tween function
	 */
	cubicBezierToEaseFunction,
	/**
	 * Convenience function for creating CSS-ready euler rotation transforms
	 * @param rotation - `RotationEulerValue`, probably from a `<RotationEuler>` component
	 * @param quaternion
	 * @returns CSS rotate X/Y/Z string ready to be passed into a CSS transform
	 */
	eulerToCssTransform,
	/**
	 * Convenience function for creating CSS-ready quaternion rotation transforms
	 * @param rotation - RotationQuaternionValue, probably from a <RotationQuaternionValue>
	 * component
	 * @returns CSS matrix3d string ready to be passed into a CSS transform
	 */
	quaternionToCssTransform,
}
