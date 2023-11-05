<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingRef, BindingOptions } from '$lib/core/Binding.svelte';
</script>

<script
	lang="ts"
	generics="T extends any, U extends BindingOptions = BindingOptions, V extends BindingRef = BindingRef"
>
	import Binding from '$lib/core/Binding.svelte';
	import type { BindingObject } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type BindableValue = BindingObject & {
		[x: string]: T;
	};

	type $$Props = Omit<ComponentProps<Binding<BindableValue, U, V>>, 'key' | 'object'> & {
		/**
		 * The value to control.
		 * @bindable
		 * */
		value: T;
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// see makeSafeKey() in past versions of utils.ts
	// for an alternative which might provide easier debugging
	const key = Symbol('key');

	function getValue(): T {
		return value;
	}

	function setValue() {
		object[key] = value;
	}

	$: object = { [key]: getValue() };
	$: value = object[key];
	$: value, setValue();
</script>

<!--
@component
This component is for internal use only.

It abstracts the `param` object Tweakpane expects into an interface that looks like a bare value.

@sourceLink [GenericBinding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericBinding.svelte)
-->

{#if BROWSER}
	<Binding bind:ref bind:object {options} {key} {...$$restProps} />
{/if}
