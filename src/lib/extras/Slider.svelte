<script lang="ts">
	import GenericSlider from '../internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends Omit<ComponentProps<GenericSlider<number>>, 'bindingParams'> {
		/** A `number` value to control. Bindable. */
		value: number;
	}

	export let value: $$Props['value'];
</script>

<!--
@component
A slider component providing fine-grained control over numerical values.

Wraps Tweakpane's [number bindings](https://tweakpane.github.io/docs/input-bindings/#number).

Note that if min and max are not defined, no linear slider widget will be provided and a input field with a draggable handle will be used instead.

Usage outside of a `<Pane>` component will implicitly wrap the slider in a `<InternalPaneInline>`.

See the `<Interval>` component for a multi-handle range-defining slider.

Example:	
```tsx
<script lang="ts">
let value = 0;

$: console.log(value);
</script>

<Slider bind:value label="Let it Slide" min={-1} max={1} format={(v) => v.toFixed(2)} />
```
-->

<GenericSlider bind:value {...$$restProps} />
