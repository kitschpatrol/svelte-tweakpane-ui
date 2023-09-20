<script lang="ts">
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ColorInputParams } from 'tweakpane';

	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	// unique
	export let value: string | RgbColorObject | RgbaColorObject;
	export let expanded: boolean = false;
	export let picker: PickerLayout = 'popup';

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// bindingParams.color.alpha,
	// bindingParams.color.type

	$: bindingParams = {
		view: 'color',
		expanded,
		picker
	} satisfies ColorInputParams;
</script>

<GenericBinding bind:value {label} {disabled} {bindingParams} />
