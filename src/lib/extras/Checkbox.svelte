<script lang="ts">
	import GenericInput from '../internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInput<boolean>>,
			'bindingParams' | 'bindingRef' | 'plugin'
		> {}

	// must redeclare for bindability
	export let value: $$Props['value'];
</script>

<!--
@component
A checkbox.

Wraps Tweakpane's [boolean input binding](https://tweakpane.github.io/docs/input-bindings/#boolean).

Usage outside of a `<Pane>` component will implicitly wrap the checkbox in `<Pane position="inline">`.

Example:	
```tsx
<script lang="ts">
	let reticulationEnabled: boolean = false;

	$: console.log(reticulationEnabled);
</script>

<Checkbox label="Reticulation" bind:value={reticulationEnabled} />
```
-->

<GenericInput bind:value {...$$restProps} />
