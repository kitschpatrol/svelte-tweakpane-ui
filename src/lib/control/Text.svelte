<script lang="ts">
	import GenericInput, { type GenericInputRef } from '$lib/internal/GenericInput.svelte';
	import { type ComponentProps, onDestroy } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericInput<string>>, 'options' | 'plugin' | 'ref'> & {
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
	};

	// Reexport for bindability
	export let value: $$Props['value'];
	export let live: $$Props['live'] = true;

	// Tweakpane's implementation only sends updates on blur we extend it to send continues change
	// updates if desired
	let ref: GenericInputRef;

	onDestroy(() => {
		updateListeners(live ?? true, true);
	});

	function onInput(event: Event): void {
		if (event.target) {
			value = (event.target as HTMLInputElement).value;
		}
	}

	function updateListeners(live: boolean, destroy: boolean = false) {
		let input = ref?.controller.valueController.view.element.querySelector('input');
		if (input) {
			input.removeEventListener('input', onInput);
			!destroy && live && input.addEventListener('input', onInput);
		}
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
position='inline'>`.

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

<GenericInput bind:value bind:ref {...$$restProps} />
