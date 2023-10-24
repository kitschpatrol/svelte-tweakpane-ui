<script lang="ts" context="module">
	import type { GenericInputRef, GenericInputOptions } from './GenericInput.svelte';
	// can't find picker options in the type definitions
	export type GenericInputFoldingOptions = GenericInputOptions & { expanded?: boolean }; // technically not shared, but useful
	export type GenericInputFoldingRef = GenericInputRef; // no changes for now?
</script>

<script
	lang="ts"
	generics="T extends any, U extends GenericInputFoldingOptions = GenericInputFoldingOptions, V extends GenericInputFoldingRef = GenericInputFoldingRef"
>
	import GenericInput from './GenericInput.svelte';
	import { updateCollapsability } from '../utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';

	// re-exported
	interface $$Props extends ComponentProps<GenericInput<T, U, V>> {
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
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// unique
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined;

	// can't be right, but no 'fold' event or 'expanded' value seems to be available,
	// and setting / reading directly from the ref doesn't seem to work
	let gotBinding = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBinding && ref) {
		gotBinding = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (e: any) => {
				internalExpanded = e.rawValue;
				expanded = internalExpanded;
			});
	}

	$: optionsInternal = {
		...options,
		picker,
		expanded: initialExpanded // only set once
	} as GenericInputFoldingOptions;

	// click instead of setting expanded
	// to avoid  animation jankiness
	$: ref && buttonClass && updateCollapsability(clickToExpand ?? true, ref.element, buttonClass);
	$: ref &&
		buttonClass &&
		expanded !== internalExpanded &&
		ref.element.getElementsByClassName(buttonClass).length > 0 &&
		(ref.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component
This component is for internal use only.

@sourceLink
-->

<GenericInput bind:value bind:ref options={optionsInternal} {...$$restProps} />
