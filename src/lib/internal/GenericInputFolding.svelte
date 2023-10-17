<script lang="ts" generics="T extends any, U extends BindingApi">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { updateCollapsability } from '$lib/utils.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingApi, PickerLayout } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';

	// re-exported
	interface $$Props extends ComponentProps<GenericInput<T, U>> {
		/** Allow users to interactively expand / contract the picker. Regardless of `clickToExpand`, programmatic control remains available through the `expanded` prop. Defaults to `true`. */
		clickToExpand?: boolean;
		/** Expand or collapse the color picker. Defaults to `true`. Bindable. */
		expanded?: boolean;
		/** Work-arounds for funky folding, internal only. */
		buttonClass?: string;
		/** Specify an `inline` or `popup` color picker control presentation. Defaults to `popup`. */
		picker?: PickerLayout; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior
	}

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let bindingRef: $$Props['bindingRef'] = undefined;
	export let bindingParams: $$Props['bindingParams'] = undefined;

	// unique
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined;

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
		picker,
		expanded: initialExpanded // only set once
	};

	// click instead of setting expanded
	// to avoid  animation jankiness
	$: bindingRef &&
		buttonClass &&
		updateCollapsability(clickToExpand ?? true, bindingRef.element, buttonClass);
	$: bindingRef &&
		buttonClass &&
		expanded !== internalExpanded &&
		bindingRef.element.getElementsByClassName(buttonClass).length > 0 &&
		(bindingRef.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.
-->

<GenericInput bind:value bind:bindingRef bindingParams={bindingParamsInternal} {...$$restProps} />
