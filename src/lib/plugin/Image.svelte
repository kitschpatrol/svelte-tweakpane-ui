<script lang="ts">
	import GenericInput from '../internal/GenericInput.svelte';
	import type { ImageResolvable } from 'tweakpane-image-plugin/dist/types/model.js';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericInput<ImageResolvable | undefined>>, 'plugin'> {
		/** TODO Docs */
		imageFit?: 'contain' | 'cover';
		/** TODO Docs */
		extensions?: string[];
		/** TODO Docs */
		value: ImageResolvable | undefined;
	}

	// unique
	export let value: $$Props['value'] = 'placeholder';
	export let imageFit: $$Props['imageFit'] = undefined;
	export let extensions: $$Props['extensions'] = undefined;

	$: bindingParams = {
		view: 'input-image',
		imageFit,
		extensions
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

{#await import('tweakpane-image-plugin') then module}
	<GenericInput bind:value {bindingParams} plugin={module} {...$$restProps} />
{/await}
