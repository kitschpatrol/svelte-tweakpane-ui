<script lang="ts">
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends ComponentProps<GenericSlider<number>> {
		value: number;
	}

	export let value: $$Props['value'];
</script>

<!--
@component
A convenience component providing a subtle visual separator between controls, in the spirit of the HTML `<hr>` element.

Note that if min and max are not defined, no linear slider widget will be provided.

Note that format only affects the display of the value int he control, to restrict the actual value use TK

Wraps Tweakpane's [separator blade](https://tweakpane.github.io/docs/blades/#separator).

Usage outside of a `<Pane>` component will implicitly wrap the separator in a `<InternalPaneInline>`.

Example:	
```tsx
<script lang="ts">

</script>

<Slider bind:value={shadowValue} label="Let it Slide" min={-1} max={1} format={(v) => v.toFixed(1)} />
```
-->

<GenericSlider bind:value {...$$restProps} />
