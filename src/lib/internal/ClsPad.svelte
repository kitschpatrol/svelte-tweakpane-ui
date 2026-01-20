<script lang="ts">
	import { DEV } from 'esm-env'
	import { getValueOrFallback, type Theme } from '$lib/theme.js'

	/**
	 * The theme to use when estimating the height of the pane.
	 */
	export let theme: Theme | undefined = undefined

	/**
	 * Theme keys to add to the height estimate.
	 */
	export let keysAdd: Array<Parameters<typeof getValueOrFallback>[1]> = []

	/**
	 * Theme keys to subtract from the height estimate.
	 */
	export let keysSubtract: Array<Parameters<typeof getValueOrFallback>[1]> = []

	/**
	 * Extra arbitrary space to add to the height estimate, in pixels.
	 */
	export let extra: number | undefined = undefined

	const showDebugBlocks = false

	function getRandomCssColor() {
		return '#' + Math.floor(Math.random() * 16_777_215).toString(16)
	}

	function getPixelValue(s: string): number {
		return Number.parseFloat(s.replace('px', ''))
	}

	function getTotal(add: typeof keysAdd, sub: typeof keysSubtract, extra: number = 0): number {
		return (
			// eslint-disable-next-line no-return-assign
			add.reduce((acc, key) => (acc += getPixelValue(getValueOrFallback(theme, key))), 0) -
			// eslint-disable-next-line no-return-assign
			sub.reduce((acc, key) => (acc += getPixelValue(getValueOrFallback(theme, key))), 0) +
			extra
		)
	}

	$: total = getTotal(keysAdd, keysSubtract, extra)
</script>

<!--
@component  
This component is for internal use only.

It's a utility to assist in estimating the rendered height of Tweakpane components for use during prerendering in an attempt to minimize layout shift upon hydration.

The associated SSR / prerendering CLS prevention feature is experimental.

@sourceLink
[ClsPad.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/ClsPad.svelte)
-->

{#if total > 0}
	<div
		style:background={DEV && showDebugBlocks ? getRandomCssColor() : null}
		style:height="{total}px"
	></div>
{/if}
