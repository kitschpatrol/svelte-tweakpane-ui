<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { SeparatorBladeParams } from 'tweakpane';

	// re-exported

	/** Prevent interactivity, just in case you consider a separator excessively interactive. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<Separator>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	let bladeParams: SeparatorBladeParams = {
		view: 'separator'
	};
</script>

<!--
@component
A convenience component providing a subtle visual separator between controls, in the spirit of the HTML `<hr>` element.

Wraps Tweakpane's [separator blade](https://tweakpane.github.io/docs/blades/#separator).

Usage outside of a `<Pane>` component will implicitly wrap the separator in a `<InternalPaneInline>`.

Example:	
```tsx
<Button title="Oil" />
<Separator />
<Button title="Water" />
```
-->

<Blade {disabled} {bladeParams} {theme} />
