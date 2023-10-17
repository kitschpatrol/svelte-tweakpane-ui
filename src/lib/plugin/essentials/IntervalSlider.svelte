<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<GenericSlider<IntervalObject>>,
			'bindingRef' | 'bindingParams' | 'plugin'
		> {
		/** TODO Docs */
		value: IntervalObject;
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
