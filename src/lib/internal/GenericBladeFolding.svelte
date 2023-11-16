<script context="module" lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BladeOptions, BladeRef } from '$lib/core/Blade.svelte';
</script>

<script generics="T extends BladeOptions, U extends BladeRef" lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import { updateCollapsibility } from '$lib/utils';
	import type { ComponentProps } from 'svelte';

	type $$Props = ComponentProps<Blade<T, U>> & {
		/**
		 * DOM class name of the button used to expand and collapse the blade's picker.
		 * @default `undefined`
		 * */
		buttonClass?: string;
		/**
		 * Allow users to interactively expand / contract the value picker by clicking its icon.
		 *
		 * Most useful when `picker` is `inline`.
		 * @default `true`
		 * */
		clickToExpand?: boolean;
		/**
		 * Expand or collapse the blade's picker.
		 * @default `true`
		 * @bindable
		 * */
		expanded?: boolean;
		/**
		 * The style of value "picker" to use in the blade.
		 * @default `'popup'`
		 */
		picker?: 'inline' | 'popup';
	};

	// reexport for bindability
	export let options: $$Props['options'];
	export let ref: $$Props['ref'] = undefined;

	// unique props
	export let clickToExpand: $$Props['clickToExpand'] = true;
	export let expanded: $$Props['expanded'] = undefined;
	export let buttonClass: $$Props['buttonClass'] = '';
	export let picker: $$Props['picker'] = undefined; // technically not guaranteed, but advantages to assuming it's there for coherent clickToExpand behavior

	//  can't be right, but no 'fold' event or 'expanded' value seems to be available
	let gotBlade = false;
	const initialExpanded = expanded;
	let internalExpanded = initialExpanded;

	$: if (!gotBlade && ref) {
		gotBlade = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(ref.controller as any)?.valueController?.foldable_
			?.value('expanded')
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.emitter.on('change', (e: any) => {
				internalExpanded = e.rawValue;
				expanded = internalExpanded;
			});
	}

	$: options = {
		...options,
		expanded: initialExpanded, // only set once
		picker
	};

	$: ref &&
		buttonClass !== undefined &&
		updateCollapsibility(clickToExpand ?? true, ref.element, buttonClass);

	// click instead of setting expanded to avoid  animation jankiness
	$: ref &&
		buttonClass !== undefined &&
		expanded !== internalExpanded &&
		ref.element.getElementsByClassName(buttonClass).length > 0 &&
		(ref.element.getElementsByClassName(buttonClass)[0] as HTMLButtonElement).click();
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericBladeFolding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericBladeFolding.svelte)
-->

<Blade bind:ref {options} {...$$restProps} />
