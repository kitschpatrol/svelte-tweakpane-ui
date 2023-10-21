<script lang="ts" context="module">
	import type { CubicBezierBladeParams } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	export type CubicBezierValue = CubicBezierBladeParams['value'];
</script>

<script lang="ts">
	import GenericBladeFolding from '../../internal/GenericBladeFolding.svelte';
	import type { CubicBezierApi } from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';

	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<GenericBladeFolding<CubicBezierBladeParams, CubicBezierApi>>,
			'bladeRef' | 'bladeParams' | 'plugin'
		> {
		/** TODO Docs */
		value: CubicBezierValue;
		/** TODO Docs */
		label?: string;
	}

	// re-exported
	// export let disabled: boolean = false;
	// export let theme: Theme | undefined = undefined;
	// export let clickToExpand: boolean = true;
	// export let expanded: boolean | undefined = undefined;
	// export let picker: PickerLayout | undefined = undefined;

	// unique
	export let label: $$Props['label'] = undefined;
	export let value: $$Props['value'];

	// reexported for access
	export let expanded: $$Props['expanded'] = undefined;

	let bladeParams: CubicBezierBladeParams;
	let cubicBezierBlade: CubicBezierApi;

	// work-arounds for funky folding
	const buttonClass = 'tp-cbzv_b';

	function getValue() {
		return value;
	}

	function setValue() {
		cubicBezierBlade.value = new CubicBezier(value[0], value[1], value[2], value[3]);
	}

	function addEvent() {
		cubicBezierBlade.on('change', (ev) => {
			value = [ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2];
		});
	}

	$: bladeParams = {
		view: 'cubicbezier',
		label,
		value: getValue()
	};
	$: cubicBezierBlade && addEvent();
	$: value, cubicBezierBlade && setValue();
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@tweakpane/plugin-essentials') then module}
	<GenericBladeFolding
		bind:expanded
		bind:bladeRef={cubicBezierBlade}
		plugin={module}
		{buttonClass}
		{bladeParams}
		{...$$restProps}
	/>
{/await}
