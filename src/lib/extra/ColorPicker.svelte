<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { PickerLayout, ColorType } from '@tweakpane/core';
	import type { ColorInputParams } from 'tweakpane';

	export let label: string = 'Color Picker';
	export let value: string | object = false;
	export let disabled: boolean = false;

	export let expanded: boolean = false;

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control
	export let alpha: boolean = false;

	// inline or popup
	export let picker: PickerLayout = 'popup';
	export let type: ColorType = 'int';

	// avoid circular
	function getValue() {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

	$: key = makeSafeKey(label);
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: bindingParams = {
		view: 'color',
		expanded,
		color: {
			alpha,
			type
		},
		label,
		picker
	} satisfies ColorInputParams;

	$: {
		console.log(`bindingParams: ${JSON.stringify(bindingParams, null, 2)}`);
	}
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
