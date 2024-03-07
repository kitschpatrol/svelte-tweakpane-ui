<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js';

	export type TextareaChangeEvent = ValueChangeEvent<string>;
</script>

<script lang="ts">
	import * as pluginModule from '@pangenerator/tweakpane-textarea-plugin';
	import type { TextareaPluginInputParams } from '@pangenerator/tweakpane-textarea-plugin/dist/types/plugin.js';
	import GenericInput, { type GenericInputRef } from '$lib/internal/GenericInput.svelte';
	import { type UnwrapCustomEvents } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { type ComponentProps, createEventDispatcher, onDestroy } from 'svelte';

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

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: TextareaChangeEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	let _value = value; // Not bound, update events handled in svelte to allow updates on blur
	let ref: GenericInputRef;
	let options: TextareaPluginInputParams;

	onDestroy(() => {
		updateListeners(live ?? true, true);
	});

	function onBlur(event: Event): void {
		value = (event.target as HTMLInputElement).value;
		lastText = value;
		dispatch('change', { value, origin: 'internal' });
	}

	function onInput(event: Event): void {
		value = (event.target as HTMLInputElement).value;
		lastText = value;
		dispatch('change', { value, origin: 'internal' });
	}

	function updateListeners(live: boolean, destroy: boolean = false) {
		const input = ref?.controller.valueController.view.element.querySelector('textarea');
		input?.removeEventListener('blur', onBlur);
		input?.removeEventListener('input', onInput);
		!destroy && live && input?.addEventListener('input', onInput);
		!destroy && !live && input?.addEventListener('blur', onBlur);
	}

	let lastText = value;
	function onBoundValueChange(text: string) {
		if (text !== lastText) {
			dispatch('change', { value: text, origin: 'external' });
			lastText = text;
		}
	}

	$: _value = value;
	$: ref && live !== undefined && updateListeners(live);
	$: options = {
		placeholder,
		rows,
		view: 'textarea'
	};
	$: ref && onBoundValueChange(_value);
</script>

<!--
@component  
A multi-line text input field, in the spirit of the HTML `<textarea>`
element.

Integrates the
[tweakpane-textarea-plugin](https://github.com/panGenerator/tweakpane-textarea-plugin)
by [Krzysztof Goliński](http://www.golinski.org) and [Jakub
Koźniewski](https://pangenerator.com).

Extends the underlying implementation with the `live` property to match the
behavior of the `<Text>` component.

Usage outside of a `<Pane>` component will implicitly wrap the text area in
`<Pane position="inline">`.

@emits {TextareaChangeEvent} change - When `value` changes. (This event is
provided for advanced use cases. Prefer binding to `value`.)

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
