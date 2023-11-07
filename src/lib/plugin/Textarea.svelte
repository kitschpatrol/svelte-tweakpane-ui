<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-textarea-plugin';
	import type { TextareaPluginInputParams } from '@kitschpatrol/tweakpane-textarea-plugin/dist/types/plugin.js';
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<GenericInput<string, TextareaPluginInputParams>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * A `string` value to control.
		 * @bindable
		 * */
		value: string;
		/**
		 * Placeholder text to display when the `value` is empty.
		 * @default `'Enter text here'`
		 */
		placeholder?: string;
		/**
		 * The number of lines of text to display.
		 * @todo can you still go over?
		 * @default `3`
		 */
		rows?: number;
	};

	// re-exported
	export let value: $$Props['value'];
	export let rows: $$Props['rows'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;

	let options: TextareaPluginInputParams;

	$: BROWSER &&
		(options = {
			placeholder,
			rows,
			view: 'textarea'
		});
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import { Textarea } from 'svelte-tweakpane-ui';

  let text = '';
</script>

<Textarea bind:value={text} placeholder="The void" rows={8} />
<pre>{text}</pre>
```

@sourceLink [Textarea.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Textarea.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
