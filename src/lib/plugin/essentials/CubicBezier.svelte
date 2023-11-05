<script lang="ts" context="module">
	export type CubicBezierValueObject = {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	};
	export type CubicBezierValueTuple = [x1: number, y1: number, x2: number, y2: number];
	export type CubicBezierValue = CubicBezierValueObject | CubicBezierValueTuple;
</script>

<script lang="ts">
	import type { CubicBezierBladeParams as CubicBezierOptions } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	import GenericBladeFolding from '$lib/internal/GenericBladeFolding.svelte';
	import type { CubicBezierApi as CubicBezierRef } from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<
		ComponentProps<GenericBladeFolding<CubicBezierOptions, CubicBezierRef>>,
		'buttonClass' | 'ref' | 'options' | 'plugin'
	> & {
		/**
		 * The cubic bezier value to control.
		 *
		 * Object value type is a convenience added by `svelte-tweakpane-ui`, and is not part of the original `@tweakpane/plugin-essentials` API.
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
	export let label: $$Props['label'] = undefined;
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;

	let options: CubicBezierOptions;
	let cubicBezierBlade: CubicBezierRef;

	// work-arounds for funky folding
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
					x2: ev.value.x2,
					y1: ev.value.y1,
					y2: ev.value.y2
				};
			}
		});
	}

	$: BROWSER &&
		(options = {
			view: 'cubicbezier',
			label,
			value: getValue()
		});
	$: BROWSER && cubicBezierBlade && addEvent();
	$: value, BROWSER && cubicBezierBlade && setValue();
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import {
    CubicBezier,
    Slider,
    RadioGrid,
    type CubicBezierValueTuple
  } from 'svelte-tweakpane-ui';
  import { tweened } from 'svelte/motion';

  let value: CubicBezierValueTuple = [0.25, 0.1, 0.25, 1.0];
  let duration = 1000;
  let moods = ['Set', 'Rise'];
  let mood: string = moods[0];

  // calculates point on curve at time
  // (or get this from your favorite library)
  function cubicBezier(
    t: number,
    cubicBezier: CubicBezierValueTuple
  ): [x: number, y: number] {
    const p0 = [0, 0];
    const p3 = [1, 1];

    const x =
      (1 - t) ** 3 * p0[0] +
      (1 - t) ** 2 * t * 3 * cubicBezier[0] +
      (1 - t) * t ** 2 * 3 * cubicBezier[2] +
      t ** 3 * p3[0];
    const y =
      (1 - t) ** 3 * p0[1] +
      (1 - t) ** 2 * t * 3 * cubicBezier[1] +
      (1 - t) * t ** 2 * 3 * cubicBezier[3] +
      t ** 3 * p3[1];

    return [x, y];
  }

  function cubicEase(t: number): number {
    return cubicBezier(t, value)[1];
  }

  function lerp(value: number, toLow: number, toHigh: number): number {
    return toLow + ((value - 0) * (toHigh - toLow)) / (1 - 0);
  }

  const positionTween = tweened(0, {
    duration,
    easing: cubicEase
  });

  $: positionTween.set(mood === 'Set' ? 0 : 1, { duration });

  $: celestialHeight = lerp($positionTween, 20, 80);
  $: twilightAmount = lerp($positionTween, 20, -80);
</script>

<CubicBezier bind:value picker="inline" expanded={true} />
<Slider
  label="Duration (Seconds)"
  bind:value={duration}
  min={0}
  max={10000}
  format={(v) => `${(v / 1000).toFixed(1)}`}
/>
<RadioGrid bind:value={mood} values={['Rise', 'Set']} />

<div class="demo" style:--a="{twilightAmount}%">
  <div class="celestial-object" style:--t="{celestialHeight}%" />
</div>

<style>
  .demo {
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(to top, orange var(--a), magenta 100%);
    position: relative;
    overflow: hidden;
  }

  .celestial-object {
    position: absolute;
    left: 50%;
    bottom: var(--t);
    transform-origin: center;
    transform: translate(-50%, 50%);
    width: 10cqw;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: yellow;
  }
</style>
```

@sourceLink [CubicBezier.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/CubicBezier.svelte)
-->

{#if BROWSER}
	<GenericBladeFolding
		bind:expanded
		bind:ref={cubicBezierBlade}
		plugin={pluginModule}
		{buttonClass}
		{options}
		{...$$restProps}
	/>
{/if}
