<script context="module" lang="ts">
	// Resolve Tweakpane's size variables the way its own stylesheet does,
	// falling back to the standard theme's sizes
	const sizeExpressions = {
		unitSize: 'var(--tp-container-unit-size, 20px)',
		unitSpacing: 'var(--tp-container-unit-spacing, 4px)',
		valueWidth: 'var(--tp-blade-value-width, 160px)',
		verticalPadding: 'var(--tp-container-vertical-padding, 4px)',
	}

	const kindsWithChildren = ['container', 'content', 'tab']
</script>

<script lang="ts">
	import type { Theme } from '#lib/theme.js'
	import { getContext } from 'svelte'

	/**
	 * The part of a pane to stand in for.
	 *
	 * - `root`: A pane. Wraps an optional `title` and a `content`.
	 * - `title`: The title bar of a pane or folder, or the tab bar of a tab group.
	 * - `content`: The area of a pane, folder, or tab page that holds its blades.
	 * - `container`: A folder, which wraps a `title` and a `content`, or a tab
	 *   group, which wraps its `tab` placeholders.
	 * - `tab`: A tab page together with the group's tab bar. Wraps a `title` and a
	 *   `content`. Only the first one in a tab group takes up space.
	 * - `blade`: A single-row control.
	 * - `separator`: A separator rule, or slotted content spaced like one.
	 * - `spacer`: Extra height for a control taller than a single row. Must
	 *   directly follow the control's `blade`.
	 *
	 * @default `'spacer'`
	 */
	export let kind:
		'blade' | 'container' | 'content' | 'root' | 'separator' | 'spacer' | 'tab' | 'title' = 'spacer'

	/**
	 * Theme of the pane (`root`) or of the control being padded (`spacer`).
	 *
	 * A `spacer` only applies it outside of a pane, where no `root` ancestor
	 * provides the theme's sizes.
	 */
	export let theme: Theme | undefined = undefined

	/**
	 * Whether the pane has a title bar. Only applies to `root`.
	 */
	export let titled: boolean = false

	/**
	 * Multiples of the theme's `containerUnitSize` in the height of a `spacer`.
	 */
	export let unitSize: number = 0

	/**
	 * Multiples of the theme's `containerUnitSpacing` in the height of a
	 * `spacer`.
	 */
	export let unitSpacing: number = 0

	/**
	 * Multiples of the theme's `containerVerticalPadding` in the height of a
	 * `spacer`.
	 */
	export let verticalPadding: number = 0

	/**
	 * Multiples of the theme's `bladeValueWidth` in the height of a `spacer`, for
	 * controls that are as tall as their value column is wide. A theme may give
	 * that width as a percentage of the blade's width.
	 */
	export let valueWidth: number = 0

	/**
	 * Multiples of the blade's width inside the pane's horizontal padding in the
	 * height of a `spacer`, for controls without a label, whose value column
	 * spans the blade.
	 */
	export let bladeWidth: number = 0

	/**
	 * Pixels in the height of a `spacer`.
	 */
	export let pixels: number = 0

	type $$Slots = {
		/**
		 * The placeholders nested inside a `root`, `container`, `tab`, or
		 * `content`.
		 */
		default: {}
	}

	function getSpacerSize(): string | undefined {
		const multipliers = { unitSize, unitSpacing, valueWidth, verticalPadding }
		const terms = Object.entries(multipliers)
			.filter(([, multiplier]) => multiplier !== 0)
			.map(
				([key, multiplier]) =>
					`${sizeExpressions[key as keyof typeof sizeExpressions]} * ${multiplier}`,
			)

		if (pixels !== 0) {
			terms.push(`${pixels}px`)
		}

		if (bladeWidth !== 0) {
			terms.push(`100% * ${bladeWidth}`)
		}

		return terms.length === 0 ? undefined : `calc(${terms.join(' + ')})`
	}

	// Nothing here may depend on what rendered before: Svelte renders parts of a
	// page more than once on the server to settle bindings, and discards all but
	// the last attempt. Layout that depends on position is left to the stylesheet.
	const className = kind === 'root' && titled ? 'cls-pad-root cls-pad-titled' : `cls-pad-${kind}`
	const hasChildren = kindsWithChildren.includes(kind)

	// A spacer outside of a pane has no root to take the theme's sizes from
	const sizes =
		kind === 'root' || (kind === 'spacer' && getContext('userCreatedPane') === undefined)
			? theme
			: undefined
	const spacerSize = kind === 'spacer' ? getSpacerSize() : undefined
</script>

<!--
@component
This component is for internal use only.

Tweakpane builds its DOM in the browser, so on the server each component renders this empty
placeholder instead. Together the placeholders form a skeleton with the same nesting, heights, and
vertical spacing as the real pane, so the page does not shift when the pane replaces the skeleton on
hydration.

Sizes are expressed in Tweakpane's own CSS variables, so the browser resolves them against whatever
theme is in effect.

The rules that lay the placeholders out are in GenericPane.svelte, because this component never runs
in the browser and a bundler may drop the styles of a component it considers unused.

Only render it on the server.

@sourceLink
[ClsPad.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/ClsPad.svelte)
-->

<!-- A spacer with no height renders nothing. Its height is handed to the stylesheet as a custom
	property, which applies it in a way that lets percentages resolve against the blade's width. -->
{#if kind === 'root' || spacerSize !== undefined}
	<div
		style:--tp-blade-value-width={sizes?.bladeValueWidth}
		style:--tp-container-horizontal-padding={sizes?.containerHorizontalPadding}
		style:--tp-container-unit-size={sizes?.containerUnitSize}
		style:--tp-container-unit-spacing={sizes?.containerUnitSpacing}
		style:--tp-container-vertical-padding={sizes?.containerVerticalPadding}
		style:--cls-pad-spacer-size={spacerSize}
		class={className}
	>
		<slot></slot>
	</div>
{:else if hasChildren}
	<div class={className}><slot></slot></div>
{:else if kind !== 'spacer'}
	<div class={className}></div>
{/if}
