<script lang="ts">
	import * as pluginModule from '@pangenerator/tweakpane-textarea-plugin';
	import type { TextareaPluginInputParams } from '@pangenerator/tweakpane-textarea-plugin/dist/types/plugin.js';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import GenericInput from '$lib/internal/GenericInput.svelte';

	type $$Props = Omit<
		ComponentProps<GenericInput<string, TextareaPluginInputParams>>,
		'options' | 'ref' | 'plugin'
	> & {
		/**
		 * The number of lines of text to display.
		 * @todo can you still go over?
		 * @default `3`
		 */
		rows?: number;
		/**
		 * Placeholder text to display when the `value` is empty.
		 * @default `'Enter text here'`
		 */
		placeholder?: string;
		/**
		 * A `string` value to control.
		 * @bindable
		 * */
		value: string;
	};

	// re-exported
	export let value: $$Props['value'];
	export let rows: $$Props['rows'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;

	let options: TextareaPluginInputParams;

	$: BROWSER &&
		(options = {
			view: 'textarea',
			rows,
			placeholder
		});
</script>

<!--
@component
TODO

@example
```tsx
TODO
```

@sourceLink [Textarea.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugins/Textarea.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
