<script lang="ts">
	import { type Theme, getValueOrFallback } from '$lib/theme.js';
	import { DEV } from 'esm-env';

	/**
	 * The theme to use when estimating the height of the pane.
	 */
	export let theme: Theme | undefined = undefined;

	/**
	 * Theme keys to add to the height estimate.
	 */
	export let keysAdd: Parameters<typeof getValueOrFallback>[1][] = [];

	/**
	 * Theme keys to subtract from the height estimate.
	 */
	export let keysSubtract: Parameters<typeof getValueOrFallback>[1][] = [];

	/**
	 * Extra arbitrary space to add to the height estimate, in pixels.
	 */
	export let extra: number | undefined = undefined;

	const showDebugBlocks = false;

	function getRandomCssColor() {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	}

	function getPixelValue(s: string): number {
		return parseFloat(s.replace('px', ''));
	}

	function getTotal(add: typeof keysAdd, sub: typeof keysSubtract, extra: number = 0): number {
		return (
			add.reduce((acc, key) => {
				return (acc += getPixelValue(getValueOrFallback(theme, key)));
			}, 0) -
			sub.reduce((acc, key) => {
				return (acc += getPixelValue(getValueOrFallback(theme, key)));
			}, 0) +
			extra
		);
	}

	$: total = getTotal(keysAdd, keysSubtract, extra);
</script>

{#if total > 0}
	<div
		style:background={DEV && showDebugBlocks ? getRandomCssColor() : null}
		style:height="{total}px"
	/>
{/if}
