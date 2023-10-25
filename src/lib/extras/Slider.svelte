<script lang="ts">
	import GenericSlider from '../internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'options'> & {
		/**
		 * A `number` value to control.
		 * @bindable.
		 * */
		value: number;
	};

	// reexport for bindability
	export let value: $$Props['value'];
</script>

<!--
@component
A slider component providing fine-grained control over numerical values.

Wraps Tweakpane's [number bindings](https://tweakpane.github.io/docs/input-bindings/#number).

Note that if `min` and `max` props are not defined, no linear slider widget will be provided and a input field with a draggable handle will be used instead.

Usage outside of a `<Pane>` component will implicitly wrap the slider in `<Pane position='inline'>`.

See the `<Interval>` component for a multi-handle range-defining slider.

@example	
```tsx
<script lang="ts">
	import { Slider } from 'svelte-tweakpane-ui';
	
	let value = 0;
</script>

<Slider bind:value label="Let it Slide" min={-1} max={1} format={(v) => v.toFixed(2)} />
<pre>
	Value: {value}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	<GenericSlider bind:value {...$$restProps} />
{/if}
