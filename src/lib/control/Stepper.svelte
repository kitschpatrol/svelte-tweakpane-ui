<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js'
	import type { SliderInputBindingApi as GenericSliderRef } from 'tweakpane'

	export type StepperChangeEvent = ValueChangeEvent<number>
</script>

<script lang="ts">
	import type { StepperInputParams } from '@kitschpatrol/tweakpane-plugin-inputs/dist/types/stepper/plugin.d.ts'
	import type { ComponentProps } from 'svelte'
	import GenericSlider from '$lib/internal/GenericSlider.svelte'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-inputs'

	type $$Props = {
		/**
		 * A `number` value to control.
		 * @bindable
		 * */
		value: number
	} & Omit<ComponentProps<GenericSlider<number>>, 'amount' | 'options' | 'plugin' | 'ref'>

	// Inheriting here with ComponentEvents makes a documentation mess
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: StepperChangeEvent
	}

	// Reexport for bindability
	export let value: $$Props['value']
	export let wide: $$Props['wide'] = undefined

	let options: StepperInputParams

	$: options = {
		view: 'stepper',
	}

	let ref: GenericSliderRef

	function updateWide(wide: boolean) {
		const inputField = ref?.element.querySelector<HTMLDivElement>('div.tp-stepv_t')
		const buttonContainer = ref?.element.querySelector<HTMLDivElement>('div.tp-stepv_s')
		const buttons = buttonContainer?.querySelectorAll<HTMLButtonElement>('button')
		if (wide) {
			inputField?.style.setProperty('display', 'none')
			buttonContainer?.style.setProperty('flex', '1')
			for (const button of buttons ?? []) {
				button.style.setProperty('flex', '1')
			}
		} else {
			inputField?.style.removeProperty('display')
		}
	}

	$: ref && wide !== undefined && updateWide(wide)
</script>

<!--
@component  

A control for simple incremental value changes.

Similar in functionality to a `<Slider>`, but with nice big buttons to increment and decrement the value.

Integrates the [Stepper](https://github.com/tallneil/tweakpane-plugin-inputs/blob/main/src/stepper/plugin.ts)
control from [Neil Shankar's](https://tallneil.io/) ["Inputs for Tweakpane
" plugin](https://github.com/tallneil/tweakpane-plugin-inputs).

Usage outside of a `<Pane>` component will implicitly wrap the stepper in `<Pane position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-inputs) of the plugin with build optimizations.

@emits {StepperChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Stepper } from 'svelte-tweakpane-ui';
  let angle = 45;
</script>

<Stepper bind:value={angle} label="Angle" step={45} />

<div class="demo" style:--a="{angle}deg"></div>

<style>
  div.demo {
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(var(--a), magenta, orange);
  }
</style>
```

@sourceLink
[Stepper.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Stepper.svelte)
-->

<GenericSlider bind:value bind:ref on:change {options} plugin={pluginModule} {...$$restProps} />
