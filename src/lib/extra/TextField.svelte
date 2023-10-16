<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** Text displayed next to control. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** A `string` value to control. Bindable. */
	export let value: string;

	/** Custom color scheme. Only applies if the `<TextField>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;
</script>

<!--
@component
A text field, in the spirit of the HTML `<input type="text">` element.

Updates to the bound value only happen on blur, not on every keystroke.

Wraps Tweakpane's [string binding](https://tweakpane.github.io/docs/input-bindings/#string).

Usage outside of a `<Pane>` component will implicitly wrap the text field in a `<InternalPaneInline>`.

Example:	
```tsx
<script lang="ts">
	let text = 'Cosmic Manifold';

	$: console.log(text);
</script>
	
<TextField bind:value={text} label="The Message" />
```
-->

<GenericInput {label} {disabled} {theme} bind:value />
