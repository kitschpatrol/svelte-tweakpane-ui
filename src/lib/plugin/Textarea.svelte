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
A multi-line text input field, in the spirit of the HTML `<textarea>` element.

Integrates the
[tweakpane-textarea-plugin](https://github.com/panGenerator/tweakpane-textarea-plugin) by [Krzysztof
Goliński](http://www.golinski.org) and [Jakub Koźniewski](https://pangenerator.com).

See <Text> for a single-line input variation.

Note that `svelte-tweakpane-ui` embeds a
[fork](https://github.com/kitschpatrol/tweakpane-textarea-plugin) of the plugin with support for
Tweakpane 4. The dependency will be updated to point to the source repository if / when the open
[pull request](https://github.com/panGenerator/tweakpane-textarea-plugin/pull/4) with Tweakpane 4
support is merged.

Usage outside of a `<Pane>` component will implicitly wrap the text area in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Textarea } from 'svelte-tweakpane-ui';

  let text = '';
</script>

<Textarea bind:value={text} placeholder="The void" rows={8} />
<pre>{text}</pre>
```

@sourceLink
[Textarea.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Textarea.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
