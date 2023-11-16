<script lang="ts">
	import { type Theme, getValueOrFallback } from '$lib/theme.js';

	export let theme: Theme | undefined = undefined;
	export let keysAdd: Parameters<typeof getValueOrFallback>[1][] = [];
	export let keysSubtract: Parameters<typeof getValueOrFallback>[1][] = [];

	/**
	 * Extra arbitrary space to add to the height estimate, in pixels.
	 */
	export let extra: number | undefined = undefined;

	// todo turn this of for prod
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
	<div style:background={getRandomCssColor()} style:height="{total}px" />
{/if}
