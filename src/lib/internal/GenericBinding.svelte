<script lang="ts" generics="T extends any, U extends BindingApi">
	import Binding from '$lib/core/Binding.svelte';
	import type { Theme } from '$lib/theme.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingApi } from '@tweakpane/core';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	// unique
	export let value: T; // bindable

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

<Binding {theme} {disabled} {label} bind:bindingRef bind:params {key} {bindingParams} />
