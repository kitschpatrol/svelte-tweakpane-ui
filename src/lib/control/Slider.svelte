<script context="module" lang="ts">
	import type { SliderInputBindingApi as GenericSliderRef } from 'tweakpane'
	import type { ValueChangeEvent } from '$lib/utils.js'

	export type SliderChangeEvent = ValueChangeEvent<number>
</script>

<script lang="ts">
	import { type ComponentProps } from 'svelte'
	import GenericSlider from '$lib/internal/GenericSlider.svelte'

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'options' | 'plugin' | 'ref'> & {
		/**
		 * A `number` value to control.
		 * @bindable.
		 */
		value: number
	}

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 * @extends ValueChangeEvent
		 * @event
		 */
		change: SliderChangeEvent
	}

	// Reexport for bindability
	export let value: $$Props['value']
	export let wide: $$Props['wide'] = undefined

	let ref: GenericSliderRef

	function updateWide(wide: boolean) {
		const inputField = ref?.element.querySelector<HTMLDivElement>('div.tp-sldtxtv_t')

		if (wide) {
			inputField?.style.setProperty('display', 'none')
		} else {
			inputField?.style.removeProperty('display')
		}
	}

	$: ref && wide !== undefined && updateWide(wide)
</script>

<!--
@component  
A slider component providing fine-grained control over numeric values.

Wraps Tweakpane's [number bindings](https://tweakpane.github.io/docs/input-bindings/#number).

Note that if `min` and `max` props are not defined, no linear slider widget will be provided and a
input field with a draggable handle will be used instead.

See the `<Interval>` component for a multi-handle range-defining slider.

Usage outside of a `<Pane>` component will implicitly wrap the slider in `<Pane position="inline">`.

@emits {SliderChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)
	
@example  
```svelte
<script lang="ts">
  import { Slider } from 'svelte-tweakpane-ui'

  let value = 0
</script>

<Slider
  bind:value
  min={-1}
  max={1}
  format={(v) => v.toFixed(2)}
  label="Let it Slide"
/>
<pre>Value: {value}</pre>
```

@sourceLink
[Slider.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Slider.svelte)
-->

<GenericSlider bind:value bind:ref on:change {...$$restProps} />
