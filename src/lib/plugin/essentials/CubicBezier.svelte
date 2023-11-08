<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils';

	export type CubicBezierValueObject = {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	};
	export type CubicBezierValueTuple = [x1: number, y1: number, x2: number, y2: number];
	export type CubicBezierValue = Simplify<CubicBezierValueObject | CubicBezierValueTuple>;
</script>

<script lang="ts">
	import type { CubicBezierApi as CubicBezierRef } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import type { CubicBezierBladeParams as CubicBezierOptions } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	import GenericBladeFolding from '$lib/internal/GenericBladeFolding.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<GenericBladeFolding<CubicBezierOptions, CubicBezierRef>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * The cubic bezier value to control.
		 *
		 * Object value type is a convenience added by `svelte-tweakpane-ui`, and is not part of the
		 * original `@tweakpane/plugin-essentials` API.
		 * @type {CubicBezierValue}
		 * @bindable
		 */
		value: CubicBezierValue;
		/**
		 * Text displayed next to the control.
		 * @default `undefined`
		 * */
		label?: string;
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let label: $$Props['label'] = undefined;
	export let expanded: $$Props['expanded'] = undefined;

	let options: CubicBezierOptions;
	let cubicBezierBlade: CubicBezierRef;

	// work-around for funky folding
	const buttonClass = 'tp-cbzv_b';

	function getValue(): CubicBezierOptions['value'] {
		if (Array.isArray(value)) {
			return value;
		} else {
			return [value.x1, value.y1, value.x2, value.y2];
		}
	}

	function setValue() {
		if (Array.isArray(value)) {
			cubicBezierBlade.value = new CubicBezier(value[0], value[1], value[2], value[3]);
		} else {
			cubicBezierBlade.value = new CubicBezier(value.x1, value.y1, value.x2, value.y2);
		}
	}

	function addEvent() {
		cubicBezierBlade.on('change', (ev) => {
			if (Array.isArray(value)) {
				value = [ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2];
			} else {
				value = {
					x1: ev.value.x1,
					y1: ev.value.y1,
					x2: ev.value.x2,
					y2: ev.value.y2
				};
			}
		});
	}

	$: BROWSER &&
		(options = {
			value: getValue(),
			label,
			view: 'cubicbezier'
		});
	$: BROWSER && cubicBezierBlade && addEvent();
	$: value, BROWSER && cubicBezierBlade && setValue();
</script>

<!--
@component  

A control for editing a bezier curve. Ideal for tweaking animation easing values.

Integrates the [Cubic Bezier](https://github.com/tweakpane/plugin-essentials#cubic-bezier) control
from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me)  [Essentials
plugin](https://github.com/tweakpane/plugin-essentials).

`svelte-tweakpane-ui` extends the original implementation to by supporting tuple values in addition
to object values.

A utility function `Utils.cubicBezierToEaseFunction()` is also provided to easily convert a cubic
bezier value to an easing function compatible with Svelte's built-in
[motion](https://svelte.dev/docs/svelte-motion),
[transition](https://svelte.dev/docs/svelte-transition), and
[animate](https://svelte.dev/docs/svelte-animate) modules.

Usage outside of a `<Pane>` component will implicitly wrap the cubic bezier control in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import {
    CubicBezier,
    type CubicBezierValue,
    RadioGrid,
    Slider,
    Utils
  } from 'svelte-tweakpane-ui';
  import { tweened } from 'svelte/motion';

  // could also be a tuple
  let value: CubicBezierValue = { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 };
  let duration = 1000;
  let moods = ['Set', 'Rise'];
  let mood: string = moods[0];

  const positionTween = tweened(0);

  function lerp(value: number, low: number, high: number): number {
    return (1 - value) * low + value * high;
  }

  $: positionTween.set(mood === 'Set' ? 0 : 1, {
    duration,
    easing: Utils.cubicBezierToEaseFunction(value)
  });

  $: celestialHeight = lerp($positionTween, 20, 80);
  $: twilightAmount = lerp($positionTween, 20, -80);
</script>

<CubicBezier bind:value expanded={true} picker="inline" />
<Slider
  bind:value={duration}
  min={0}
  max={10000}
  format={(v) => `${(v / 1000).toFixed(1)}`}
  label="Duration (Seconds)"
/>
<RadioGrid bind:value={mood} values={['Rise', 'Set']} />

<div class="demo" style:--a="{twilightAmount}%">
  <div class="celestial-object" style:--t="{celestialHeight}%" />
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
    width: 10cqw;
    background-color: yellow;
    border-radius: 50%;
  }
</style>
```

@sourceLink
[CubicBezier.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/CubicBezier.svelte)
-->

{#if BROWSER}
	<GenericBladeFolding
		bind:expanded
		bind:ref={cubicBezierBlade}
		{buttonClass}
		{options}
		plugin={pluginModule}
		{...$$restProps}
	/>
{/if}

<style>
	/* Fix overflow bug from the plugin TODO PR */
	:global(div.tp-cbzv:not(tp-cbzv-expanded) div.tp-cbzv_p) {
		overflow: hidden !important;
	}
</style>
