<script context="module" lang="ts">
	import type { GenericInputOptions, GenericInputRef } from '$lib/internal/GenericInput.svelte';
	// can't find picker options in the type definitions
	export type GenericInputFoldingOptions = GenericInputOptions & { expanded?: boolean }; // technically not shared, but useful
	export type GenericInputFoldingRef = GenericInputRef; // no changes for now?
</script>

<script
	generics="T extends any, U extends GenericInputFoldingOptions = GenericInputFoldingOptions, V extends GenericInputFoldingRef = GenericInputFoldingRef"
	lang="ts"
>
	import type { PickerLayout } from '@tweakpane/core';
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { updateCollapsibility } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// TODO share prop definitions with GenericBladeFolding?
	type $$Props = ComponentProps<GenericInput<T, U, V>> & {
		/**
		 * DOM class name of the button used to expand and collapse the input's picker.
		 * @default `undefined`
		 * */
		buttonClass?: string;
		/**
		 * Allow users to interactively expand / contract the picker.
		 * @default `true`
		 * */
		clickToExpand?: boolean;
		/**
		 * Expand or collapse the input's picker.
		 * @default `true`
		 * @bindable
		 * */
		expanded?: boolean;
		/**
		 * The style of value "picker" to use in the input.
		 * @default `'popup'`
		 */
		picker?: PickerLayout; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// unique props
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined;

	let optionsInternal: GenericInputFoldingOptions;

	// can't be right, but no 'fold' event or 'expanded' value seems to be available, and setting /
	// reading directly from the ref doesn't seem to work
	let gotBinding = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (BROWSER && !gotBinding && ref) {
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

	$: BROWSER &&
		(optionsInternal = {
			...options,
			expanded: initialExpanded, // only set once
			picker
		});

	// click instead of setting expanded to avoid  animation jankiness
	$: BROWSER &&
		ref &&
		buttonClass &&
		updateCollapsibility(clickToExpand ?? true, ref.element, buttonClass);
	$: BROWSER &&
		ref &&
		buttonClass &&
		expanded !== internalExpanded &&
		ref.element.getElementsByClassName(buttonClass).length > 0 &&
		(ref.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericInputFolding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericInputFolding.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value bind:ref options={optionsInternal} {...$$restProps} />
{/if}
