<script lang="ts" context="module">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingRef, BindingOptions, BindingObject } from '../core/Binding.svelte';
</script>

<script
	lang="ts"
	generics="T extends any, U extends BindingOptions = BindingOptions, V extends BindingRef = BindingRef"
>
	import Binding from '../core/Binding.svelte';
	import type { ComponentProps } from 'svelte';

	interface BindableValue extends BindingObject {
		[x: string]: T;
	}

	interface $$Props extends Omit<ComponentProps<Binding<BindableValue, U, V>>, 'key' | 'object'> {
		/** Value to manipulate. */
		value: T;
	}

	export let value: $$Props['value'];
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// TODO but is a UUID overkill since the scope is contained? consider just 'k'?
	// using the label as a key means components get recreated when labels change...
	// this has some advantages in terms of readability when inspecting runtime code, but probably
	// isn't worth it from a performance perspective...
	// but full UUID only hypothetically useful in some kind of save / restore scenario?
	// $: key = makeSafeKey(label);
	const key = 'k';

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

It abstracts the param object Tweakpane expects into an
interface that looks like a bare value
-->

<Binding bind:ref bind:object {options} {key} {...$$restProps} />
