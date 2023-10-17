<script lang="ts" generics="T extends string | boolean | number">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { ComponentProps } from 'svelte';
	import type { BindingApi } from '@tweakpane/core';
	import type { ListParamsOptions } from 'tweakpane';
	import { beforeUpdate, onMount } from 'svelte';

	interface ListInputParams {
		options: ListParamsOptions<T>;
	}

	interface $$Props
		extends Omit<ComponentProps<GenericInput<T, BindingApi>>, 'bindingParams' | 'bindingRef'> {
		// override documentation
		/** Value of the selected item. Bindable. If the bound value is undefined at the time the component is created, then it is set to the first value of the `options` prop array or object. */
		value: T;
		// unique props
		/** A collection of options, either an array of type `{text: string; value: T}[]` or an object of type `{[text: string]: T;};`. Keys must be strings, but values are generic.  */
		options: ListParamsOptions<T>;
	}

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let options: $$Props['options'];

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

<GenericInput bind:value {bindingParams} {...$$restProps} />
