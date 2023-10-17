<script lang="ts">
	import GenericInput from '../internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericInput<string>>, 'bindingParams' | 'bindingRef' | 'plugin'> {
		/** TODO Docs */
		rows?: number;
		/** TODO Docs */
		placeholder?: string;
		/** TODO Docs */
		value: string;
	}

	// re-exported
	export let value: $$Props['value'];
	export let rows: $$Props['rows'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;

	$: bindingParams = {
		view: 'textarea',
		rows,
		placeholder
	};
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@pangenerator/tweakpane-textarea-plugin') then module}
	<GenericInput bind:value {bindingParams} plugin={module} {...$$restProps} />
{/await}
