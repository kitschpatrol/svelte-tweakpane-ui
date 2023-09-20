<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ColorInputParams } from 'tweakpane';

	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';

	export let label: string = 'Color Picker';
	export let value: string | RgbColorObject | RgbaColorObject;
	export let disabled: boolean = false;
	export let expanded: boolean = false;

	let bindingParams: ColorInputParams;

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// bindingParams.color.alpha,
	// bindingParams.color.type

	// inline or popup
	export let picker: PickerLayout = 'popup';

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
		label,
		picker
	};
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
