<script lang="ts">
	// TODO live update mode
	import GenericInput from '../internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericInput<string>>, 'bindingParams' | 'bindingRef' | 'plugin'> {
		/** A `string` value to control. Bindable. */
		value: string;
	}

	export let value: $$Props['value'];
</script>

<!--
@component
A text field, in the spirit of the HTML `<input type="text">` element.

Updates to the bound value only happen on blur, not on every keystroke.

Wraps Tweakpane's [string binding](https://tweakpane.github.io/docs/input-bindings/#string).

Usage outside of a `<Pane>` component will implicitly wrap the text field in `<Pane position="inline">`.

Example:	
```tsx
<script lang="ts">
	let text = 'Cosmic Manifold';

	$: console.log(text);
</script>
	
<TextField bind:value={text} label="The Message" />
```
-->

<GenericInput bind:value {...$$restProps} />
