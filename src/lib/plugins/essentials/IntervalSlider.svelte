<script lang="ts" context="module">
	// TODO support tuple
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	export type IntervalSliderValue = IntervalObject;
</script>

<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<GenericSlider<IntervalObject>>,
			'bindingRef' | 'bindingParams' | 'plugin'
		> {
		/** TODO Docs */
		value: IntervalSliderValue;
	}

	export let value: $$Props['value'];
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
	<GenericSlider bind:value plugin={module} {...$$restProps} />
{/await}
