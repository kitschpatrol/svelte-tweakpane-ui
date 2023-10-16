<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** Text displayed next to control. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<Checkbox>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	// unique

	/** A `boolean` value to control. Bindable. */
	export let value: boolean = false;
</script>

<!--
@component
A checkbox.

Wraps Tweakpane's [boolean input binding](https://tweakpane.github.io/docs/input-bindings/#boolean).

Usage outside of a `<Pane>` component will implicitly wrap the checkbox in a `<InternalPaneInline>`.

Example:	
```tsx
<script lang="ts">
	let reticulationEnabled: boolean = false;

	$: console.log(reticulationEnabled);
</script>

<Checkbox label="Reticulation" bind:value={reticulationEnabled} />
```
-->

<GenericInput bind:value {label} {disabled} {theme} />
