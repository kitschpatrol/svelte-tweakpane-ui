<script lang="ts" generics="T extends string | boolean | number">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { ListParamsOptions } from 'tweakpane';
	import { beforeUpdate, onMount } from 'svelte';

	interface ListInputParams {
		options: ListParamsOptions<T>;
	}

	// re-exported

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Text displayed next to control. */
	export let label: string | undefined = undefined;

	/** Custom color scheme. Only applies if the `<List>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	// unique

	// TODO something to handle bare arrays and transcribe them into ArrayStyleListOptions<T>?
	/** A collection of options, either an array of type `{text: string; value: T}[]` or an object of type `{[text: string]: T;};`. Keys must be strings, but values are generic.  */
	export let options: ListParamsOptions<T>;

	// TODO understand limits of generic options
	/** Value of the selected item. Bindable. If the bound value is undefined at the time the component is created, then it is set to the first value of the `options` prop array or object. */
	export let value: T;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	beforeUpdate(() => {
		if (!isMounted) {
			// If value is undefined on first run, set it to the first item in the options array or object
			if (value === undefined) {
				if (Array.isArray(options)) {
					value = options[0].value;
				} else {
					value = options[Object.keys(options)[0]];
				}
			}
		}
	});

	$: bindingParams = {
		options
	} satisfies ListInputParams;
</script>

<!--
@component
An option list picker, similar to an HTML `<select>` element.

Wraps Tweakpane's list input binding. See Tweakpane's documentation for [number lists](https://tweakpane.github.io/docs/input-bindings/#number_list) and [string lists](https://tweakpane.github.io/docs/input-bindings/#string_list).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in a `<InternalPaneInline>`.

Example:	
```tsx
<script lang="ts">
	let selection: number = 1;

	$: console.log(selection);
</script>

<List label="Alphanumerics" bind:value={selection} options={{ a: 1, b: 2, c: 3 }} />
```
-->

<GenericInput bind:value {label} {disabled} {bindingParams} {theme} />
