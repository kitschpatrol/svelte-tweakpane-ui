<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils'
	import type { ValueChangeEvent } from '$lib/utils.js'

	export type CubicBezierValueObject = {
		x1: number
		y1: number
		x2: number
		y2: number
	}
	export type CubicBezierValueTuple = [x1: number, y1: number, x2: number, y2: number]
	export type CubicBezierValue = Simplify<CubicBezierValueObject | CubicBezierValueTuple>

	export type CubicBezierChangeEvent = ValueChangeEvent<CubicBezierValue>
</script>

<script lang="ts">
	/* TODO Fix overflow bug from the plugin...
	/* <style>
	/*    :global(div.svelte-tweakpane-ui div.tp-cbzv:not(tp-cbzv-expanded) div.tp-cbzv_p) {
	/* 	  overflow: hidden !important;
	/*   }
  /* </style> 
  */

	// TODO calc util already in TP?
	import type { CubicBezierApi as CubicBezierRef } from '@kitschpatrol/tweakpane-plugin-essentials'
	import type { CubicBezierBladeParams as CubicBezierOptions } from '@kitschpatrol/tweakpane-plugin-essentials/dist/types/cubic-bezier/plugin.d.ts'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericBladeFolding from '$lib/internal/GenericBladeFolding.svelte'
	import { fillWith, type UnwrapCustomEvents } from '$lib/utils'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-essentials'
	import { CubicBezier } from '@kitschpatrol/tweakpane-plugin-essentials'
	import { BROWSER } from 'esm-env'
	import copy from 'fast-copy'
	import { shallowEqual } from 'fast-equals'
	import { type ComponentProps, createEventDispatcher } from 'svelte'

	type $$Props = {
		/**
		 * The cubic bezier value to control.
		 *
		 * Object value type is a convenience added by _Svelte Tweakpane UI_, and is not part of the
		 * original `@tweakpane/plugin-essentials` API.
		 * @bindable
		 */
		value: CubicBezierValue
		/**
		 * Text displayed next to the control.
		 * @default `undefined`
		 * */
		label?: string
	} & Omit<
		ComponentProps<GenericBladeFolding<CubicBezierOptions, CubicBezierRef>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	>

	// Reexport for bindability
	export let value: $$Props['value']
	export let label: $$Props['label'] = undefined
	export let expanded: $$Props['expanded'] = undefined

	// Inheriting here with ComponentEvents makes a documentation mess
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
		change: CubicBezierChangeEvent
	}

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>()

	let options: CubicBezierOptions
	let cubicBezierBlade: CubicBezierRef

	// Work-around for funky folding
	const buttonClass = 'tp-cbzv_b'

	// Object to array if needed
	function getValue(): CubicBezierOptions['value'] {
		return Array.isArray(value) ? value : [value.x1, value.y1, value.x2, value.y2]
	}

	function setValue() {
		if (
			!shallowEqual(getValue(), [
				cubicBezierBlade.value.x1,
				cubicBezierBlade.value.y1,
				cubicBezierBlade.value.x2,
				cubicBezierBlade.value.y2,
			])
		) {
			// CubicBezier is a blade, not a binding, so state must be synced manually
			cubicBezierBlade.value = Array.isArray(value)
				? new CubicBezier(value[0], value[1], value[2], value[3])
				: new CubicBezier(value.x1, value.y1, value.x2, value.y2)

			dispatch('change', {
				value: copy(value),
				origin: 'external',
			})
		}
	}

	function addEvent() {
		cubicBezierBlade.on('change', (event) => {
			if (
				!shallowEqual(getValue(), [event.value.x1, event.value.y1, event.value.x2, event.value.y2])
			) {
				value = Array.isArray(value)
					? [event.value.x1, event.value.y1, event.value.x2, event.value.y2]
					: {
							x1: event.value.x1,
							y1: event.value.y1,
							x2: event.value.x2,
							y2: event.value.y2,
						}

				dispatch('change', {
					value: copy(value),
					origin: 'internal',
				})
			}
		})
	}

	$: options = {
		value: getValue(),
		label,
		view: 'cubicbezier',
	}
	$: cubicBezierBlade && addEvent()
	$: value, cubicBezierBlade && setValue()
</script>

<!--
@component  

A control for editing a bezier curve. Ideal for tweaking animation easing values.

Integrates the [Cubic Bezier](https://github.com/tweakpane/plugin-essentials#cubic-bezier) control
from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me)  [Essentials
plugin](https://github.com/tweakpane/plugin-essentials).

_Svelte Tweakpane UI_ extends the original implementation to by supporting tuple values in addition
to object values.

A utility function `Utils.cubicBezierToEaseFunction()` is also provided to easily convert a cubic
bezier value to an easing function compatible with Svelte's built-in
[motion](https://svelte.dev/docs/svelte-motion),
[transition](https://svelte.dev/docs/svelte-transition), and
[animate](https://svelte.dev/docs/svelte-animate) modules.

Usage outside of a `<Pane>` component will implicitly wrap the cubic bezier control in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a [fork](https://github.com/kitschpatrol/tweakpane-plugin-essentials) of the plugin with build optimizations and [a fix for a performance issue](https://github.com/tweakpane/plugin-essentials/pull/21). The fork also changes the package name from `@tweakpane/plugin-essentials` to `@kitschpatrol/tweakpane-plugin-essentials` for consistency with other plugins.

@emits {CubicBezierChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import {
    CubicBezier,
    type CubicBezierValue,
    RadioGrid,
    Slider,
    Utils,
  } from 'svelte-tweakpane-ui'
  import { tweened } from 'svelte/motion'

  // could also be a tuple
  let value: CubicBezierValue = {
    x1: 0.25,
    y1: 0.1,
    x2: 0.25,
    y2: 1,
  }
  let duration = 1000
  let moods = ['Set', 'Rise']
  let mood: string = moods[0]

  const positionTween = tweened(0)

  function lerp(value: number, low: number, high: number): number {
    return (1 - value) * low + value * high
  }

  $: positionTween.set(mood === 'Set' ? 0 : 1, {
    duration,
    easing: Utils.cubicBezierToEaseFunction(value),
  })

  $: celestialHeight = lerp($positionTween, 20, 80)
  $: twilightAmount = lerp($positionTween, 20, -80)
</script>

<CubicBezier bind:value expanded={true} picker="inline" />
<Slider
  bind:value={duration}
  min={0}
  max={10_000}
  format={(v) => `${(v / 1000).toFixed(1)}`}
  label="Duration (Seconds)"
/>
<RadioGrid bind:value={mood} values={['Rise', 'Set']} />

<div class="demo" style:--a="{twilightAmount}%">
  <div class="celestial-object" style:--t="{celestialHeight}%"></div>
</div>

<style>
  .demo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(to top, orange var(--a), magenta 100%);
  }

  .celestial-object {
    position: absolute;
    bottom: var(--t);
    left: 50%;
    transform-origin: center;
    transform: translate(-50%, 50%);
    aspect-ratio: 1;
    width: 20%;
    background-color: yellow;
    border-radius: 50%;
  }
</style>
```

@sourceLink
[CubicBezier.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/CubicBezier.svelte)
-->

<GenericBladeFolding
	bind:expanded
	bind:ref={cubicBezierBlade}
	{buttonClass}
	{options}
	plugin={pluginModule}
	{...$$restProps}
/>
{#if !BROWSER}
	<ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} />
	{#if expanded && $$props.picker === 'inline'}
		<ClsPad keysAdd={fillWith('containerUnitSize', 6)} theme={$$props.theme} />
		<ClsPad keysAdd={fillWith('containerUnitSpacing', 2)} theme={$$props.theme} />
	{/if}
{/if}
