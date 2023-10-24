<script lang="ts">
	import GenericInput from '../internal/GenericInput.svelte';
	import * as pluginModule from '@pangenerator/tweakpane-textarea-plugin';
	import type { ComponentProps } from 'svelte';
	import type { TextareaPluginInputParams } from '@pangenerator/tweakpane-textarea-plugin/dist/types/plugin.js';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInput<string, TextareaPluginInputParams>>,
			'options' | 'ref' | 'plugin'
		> {
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

	$: options = {
		view: 'textarea',
		rows,
		placeholder
	} as TextareaPluginInputParams;
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```

@sourceLink
-->

<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
