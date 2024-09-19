<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js';

	export type TextChangeEvent = ValueChangeEvent<string>;
</script>

<script lang="ts">
	import GenericInput, { type GenericInputRef } from '$lib/internal/GenericInput.svelte';
	import { type ComponentProps, onDestroy } from 'svelte';

	type $$Props = {
		/**
		 * A `string` value to control.
		 * @bindable
		 * */
		value: string;
		/**
		 * Whether to provide live updates to the bound `value` on every keystroke.
		 *
		 * To match expectations around reactive components, the default here diverges from the
		 * vanilla JS Tweakpane behavior, which only updates on blur.
		 * @default `true`
		 * */
		live?: boolean;
	} & Omit<ComponentProps<GenericInput<string>>, 'options' | 'plugin' | 'ref'>;

	// Reexport for bindability
	export let value: $$Props['value'];
	export let live: $$Props['live'] = true;

	// Inheriting here with ComponentEvents makes a documentation mess
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
		change: TextChangeEvent;
	};

	// Do not allow for automatic detection of hex / color strings
	// See https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/17
	const options = { view: 'text' };

	// Tweakpane's implementation only sends updates on blur we extend it to send continues change
	// updates if desired
	let ref: GenericInputRef;

	onDestroy(() => {
		updateListeners(live ?? true, true);
	});

	function onInput(event: Event): void {
		event.target?.dispatchEvent(new Event('change'));
	}

	function updateListeners(live: boolean, destroy: boolean = false) {
		const input = ref?.controller.valueController.view.element.querySelector('input');
		input?.removeEventListener('input', onInput);
		!destroy && live && input?.addEventListener('input', onInput);
	}

	$: ref && live !== undefined && updateListeners(live);
</script>

<!--
@component  
A text field, in the spirit of the HTML `<input type="text">` element.

Wraps Tweakpane's [string binding](https://tweakpane.github.io/docs/input-bindings/#string).

Extends the vanilla JS Tweakpane API to update the bound value on every keystroke. (If you prefer
Tweakpane's default behavior of only updating on blur, set `live={false}`.)

See `<TextArea>` for a multi-line input variation.

Usage outside of a `<Pane>` component will implicitly wrap the text field in `<Pane
position="inline">`.

@emits {TextChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Text } from 'svelte-tweakpane-ui';

  let text = 'Cosmic Manifold';
</script>

<Text bind:value={text} label="The Message" />
<pre>Message: {text}</pre>
```

@sourceLink
[Text.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Text.svelte)
-->

<GenericInput bind:value bind:ref on:change {options} {...$$restProps} />
