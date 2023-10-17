<script lang="ts" generics="T extends any">
	import type { Bindable } from '@tweakpane/core';

	import Binding from '$lib/core/Binding.svelte';
	import type { ComponentProps } from 'svelte';

	interface BindableValue extends Bindable {
		[x: string]: T;
	}

	interface $$Props extends Omit<ComponentProps<Binding<BindableValue>>, 'key' | 'params'> {
		/** DOC TEST */
		value: T;
	}

	export let value: $$Props['value'];
	export let bindingRef: $$Props['bindingRef'] = undefined;
	export let bindingParams: $$Props['bindingParams'] = undefined;

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
		params[key] = value;
	}

	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
</script>

<!--
@component
This component is for internal use only.

It abstracts the param object Tweakpane expects into an
interface that looks like a bare value
-->

<Binding bind:bindingRef bind:params {bindingParams} {key} {...$$restProps} />
