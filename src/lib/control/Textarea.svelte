<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-textarea-plugin';
	import type { TextareaPluginInputParams } from '@kitschpatrol/tweakpane-textarea-plugin/dist/types/plugin.js';
	import GenericInput, { type GenericInputRef } from '$lib/internal/GenericInput.svelte';
	import { BROWSER } from 'esm-env';
	import { type ComponentProps, onDestroy } from 'svelte';

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
		 * Whether to provide live updates to the bound `value` on every keystroke.
		 * @default `true`
		 * */
		live?: boolean;
		/**
		 * Placeholder text to display when the `value` is empty.
		 * @default `'Enter text here'`
		 */
		placeholder?: string;
		/**
		 * The number of lines of text to display.
		 *
		 * If lines of input exceed this value, then the text area will scroll.
		 * @default `3`
		 */
		rows?: number;
	};

	// Re-exported
	export let value: $$Props['value'];
	export let live: $$Props['live'] = true;
	export let rows: $$Props['rows'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;

	let _value = value; // Not bound, update events handled in svelte to allow updates on blur
	let ref: GenericInputRef;
	let options: TextareaPluginInputParams;

	onDestroy(() => {
		updateListeners(live ?? true, true);
	});

	function onBlur(event: Event): void {
		value = (event.target as HTMLInputElement).value;
	}

	function onInput(event: Event): void {
		value = (event.target as HTMLInputElement).value;
	}

	function updateListeners(live: boolean, destroy: boolean = false) {
		const input = ref?.controller.valueController.view.element.querySelector('textarea');
		if (input) {
			input.removeEventListener('blur', onBlur);
			input.removeEventListener('input', onInput);
			!destroy && live && input.addEventListener('input', onInput);
			!destroy && !live && input.addEventListener('blur', onBlur);
		}
	}

	$: _value = value;
	$: ref && live !== undefined && updateListeners(live);
	$: options = {
		placeholder,
		rows,
		view: 'textarea'
	};
</script>

<!--
@component  
A multi-line text input field, in the spirit of the HTML `<textarea>` element.

Integrates the
[tweakpane-textarea-plugin](https://github.com/panGenerator/tweakpane-textarea-plugin) by [Krzysztof
Goliński](http://www.golinski.org) and [Jakub Koźniewski](https://pangenerator.com).

Extends the underlying implementation with the `live` property to match the behavior of the `<Text>`
component.

Note that _Svelte Tweakpane UI_ embeds a
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
[Textarea.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Textarea.svelte)
-->

<GenericInput value={_value} bind:ref {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	<!-- TODO magic numbers -->
	<div style:height={`calc(${16 * (rows ?? 3)}px - 14px)`} />
	<!-- <ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} /> -->
{/if}
