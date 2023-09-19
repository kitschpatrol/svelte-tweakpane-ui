<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { BindingParams } from 'tweakpane';

	export let label: string = 'Checkbox';
	export let value: boolean = false;
	export let disabled: boolean = false;
	export let readonly: boolean = false;

	const key = 'key';

	let params = { [key]: value };

	// avoid circular
	function setValue() {
		params[key] = value;
	}

	$: value = params[key];
	$: value, setValue();
	$: bindingParams = { label, readonly };
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
