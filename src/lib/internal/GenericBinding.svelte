<script context="module" lang="ts">
	import type { BindingOptions, BindingRef } from '$lib/core/Binding.svelte'
</script>

<script
	generics="T extends any, U extends BindingOptions = BindingOptions, V extends BindingRef = BindingRef"
	lang="ts"
>
	import type { BindingObject } from '$lib/utils.js'
	import type { ComponentProps } from 'svelte'
	import Binding from '$lib/core/Binding.svelte'
	import { shallowEqual } from 'fast-equals'

	type BindableValue = BindingObject & Record<string, T>

	type $$Props = {
		/**
		 * The value to control.
		 * @bindable
		 * */
		value: T
	} & Omit<ComponentProps<Binding<BindableValue, U, V>>, 'key' | 'object'>

	// Reexport for bindability
	export let value: $$Props['value']
	export let ref: $$Props['ref'] = undefined
	export let options: $$Props['options'] = undefined

	// See makeSafeKey() in past versions of utils.ts for an alternative which might provide easier
	// debugging
	const key = Symbol('key')

	function getValue(): T {
		return value
	}

	function setValue() {
		if (!shallowEqual(value, object[key])) {
			// TODO reactive reassign here and in the template below
			object[key] = value
		}
	}

	// eslint-disable-next-line svelte/no-immutable-reactive-statements
	$: object = { [key]: getValue() }
	$: value = object[key]
	$: value, setValue()
</script>

<!--
@component  
This component is for internal use only.

It abstracts the `param` object Tweakpane expects into an interface that looks like a bare value.

@sourceLink
[GenericBinding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericBinding.svelte)
-->

<Binding bind:object bind:ref on:change {key} {options} {...$$restProps} />
