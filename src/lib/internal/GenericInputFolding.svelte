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
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { updateCollapsibility } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';

	// TODO share prop definitions with GenericBladeFolding?
	type $$Props = ComponentProps<GenericInput<T, U, V>> & {
		/**
		 * DOM class name of the button used to expand and collapse the input's picker.
		 * @default `undefined`
		 * */
		buttonClass?: string;
		/**
		 * Expand or collapse the input's picker.
		 * @default `false`
		 * @bindable
		 * */
		expanded?: boolean;
		/**
		 * The style of value "picker" to use in the input.
		 * @default `'popup'`
		 */
		picker?: 'inline' | 'popup'; // technically not guaranteed, but advantages to assuming it's there for coherent userExpandable behavior
		/**
		 * Allow users to interactively expand / contract the picker.
		 * @default `true`
		 * */
		userExpandable?: boolean;
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// unique props
	export let userExpandable: $$Props['userExpandable'] = true;
	export let expanded: $$Props['expanded'] = false;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined;

	let optionsInternal: GenericInputFoldingOptions;

	// can't be right, but no 'fold' event or 'expanded' value seems to be available, and setting /
	// reading directly from the ref doesn't seem to work
	let gotBinding = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBinding && ref) {
		gotBinding = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (event: any) => {
				internalExpanded = event.rawValue;
				expanded = internalExpanded;
			});
	}

	$: optionsInternal = {
		...options,
		expanded: initialExpanded, // only set once
		picker
	};

	// click instead of setting expanded to avoid  animation jankiness
	$: ref && buttonClass && updateCollapsibility(userExpandable ?? true, ref.element, buttonClass);
	$: ref &&
		buttonClass &&
		expanded !== internalExpanded &&
		ref.element.querySelectorAll(`.${buttonClass}`).length > 0 &&
		(ref.element.querySelector(`.${buttonClass}`) as HTMLButtonElement).click();
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericInputFolding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericInputFolding.svelte)
-->

<GenericInput bind:value bind:ref options={optionsInternal} {...$$restProps} />
