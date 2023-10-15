<script lang="ts" generics="T extends any, U extends BindingApi">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';
	import { updateCollapsability } from '$lib/utils.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingApi } from '@tweakpane/core';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;
	export let value: T; //bound

	// unique
	export let collapsable: boolean = true;
	export let expanded: boolean | undefined = undefined;
	export let buttonClass: string = '';

	// can't be right, but no 'fold' event or 'expanded' value seems to be available,
	// and setting / reading directly from the bindingRef doesn't seem to work
	let gotBinding = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBinding && bindingRef) {
		gotBinding = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(bindingRef.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (e: any) => {
				internalExpanded = e.rawValue;
				expanded = internalExpanded;
			});
	}

	$: bindingParamsInternal = {
		...bindingParams,
		expanded: initialExpanded // only set once
	};

	// click isntead of setting expanded
	// to avoid  animation jankiness
	$: bindingRef && updateCollapsability(collapsable, bindingRef.element, buttonClass);
	$: bindingRef &&
		expanded !== internalExpanded &&
		bindingRef.element.getElementsByClassName(buttonClass).length > 0 &&
		(bindingRef.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.
-->

<GenericInput
	{theme}
	{label}
	{disabled}
	bind:bindingRef
	bindingParams={bindingParamsInternal}
	bind:value
/>
